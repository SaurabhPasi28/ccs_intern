-- ========================================
-- 1. CATEGORIES TABLE
-- ========================================
CREATE TABLE skill_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(50),
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- 2. LANGUAGES TABLE (Per Category)
-- ========================================
CREATE TABLE skill_languages (
    id SERIAL PRIMARY KEY,
    category_id INT NOT NULL REFERENCES skill_categories(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(category_id, name)
);

-- ========================================
-- 3. SKILL TESTS TABLE
-- One exam per Language + Level combination
-- ========================================
CREATE TABLE skill_tests (
    id SERIAL PRIMARY KEY,
    language_id INT NOT NULL REFERENCES skill_languages(id) ON DELETE CASCADE,
    level VARCHAR(50) NOT NULL CHECK (level IN ('Beginner', 'Intermediate', 'Advanced', 'Professional')),
    
    title VARCHAR(150) NOT NULL,
    description TEXT,
    duration_minutes INT NOT NULL DEFAULT 60,
    passing_percentage INT DEFAULT 40,
    
    -- Question counts by type
    mcq_count INT DEFAULT 10,
    fill_blank_count INT DEFAULT 5,
    programming_count INT DEFAULT 10,
    total_questions INT GENERATED ALWAYS AS (mcq_count + fill_blank_count + programming_count) STORED,
    
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- UNIQUE CONSTRAINT: Only ONE exam per language-level combination
    UNIQUE(language_id, level)
);

-- ========================================
-- 4. TEST MODULES (Question Organization)
-- ========================================
CREATE TABLE skill_test_modules (
    id SERIAL PRIMARY KEY,
    test_id INT NOT NULL REFERENCES skill_tests(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    module_type VARCHAR(50) NOT NULL CHECK (module_type IN ('MCQ', 'FILL_BLANK', 'PROGRAMMING')),
    description TEXT,
    display_order INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- 5. TEST QUESTIONS
-- ========================================
CREATE TABLE skill_test_questions (
    id SERIAL PRIMARY KEY,
    test_id INT NOT NULL REFERENCES skill_tests(id) ON DELETE CASCADE,
    module_id INT NOT NULL REFERENCES skill_test_modules(id) ON DELETE CASCADE,
    
    question_type VARCHAR(50) NOT NULL CHECK (question_type IN ('MCQ', 'FILL_BLANK', 'PROGRAMMING')),
    question TEXT NOT NULL,
    
    -- For MCQ
    option_a TEXT,
    option_b TEXT,
    option_c TEXT,
    option_d TEXT,
    
    -- Correct answer (for all types)
    correct_answer TEXT NOT NULL,
    
    -- For programming questions
    starter_code TEXT,
    test_cases JSON,
    
    points INT DEFAULT 1,
    display_order INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- 6. TEST ATTEMPTS (With Token Security)
-- ========================================
CREATE TABLE skill_test_attempts (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    test_id INT NOT NULL REFERENCES skill_tests(id) ON DELETE CASCADE,
    
    -- Token security
    attempt_token VARCHAR(255) UNIQUE NOT NULL,
    token_expires_at TIMESTAMP NOT NULL,
    
    -- Timestamps
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    submitted_at TIMESTAMP,
    
    -- Results
    total_questions INT,
    correct_answers INT,
    status VARCHAR(20) DEFAULT 'IN_PROGRESS' CHECK (status IN ('IN_PROGRESS', 'COMPLETED')),
    result_status VARCHAR(20) CHECK (result_status IN ('PASSED', 'FAILED')),
    
    -- Current progress
    current_module_id INT REFERENCES skill_test_modules(id),
    current_question_id INT REFERENCES skill_test_questions(id),
    
    -- Prevent multiple attempts: Only ONE completed attempt per test per user
    CONSTRAINT unique_completed_attempt UNIQUE(user_id, test_id, status),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- 7. USER ANSWERS
-- ========================================
CREATE TABLE skill_test_answers (
    id SERIAL PRIMARY KEY,
    attempt_id INT NOT NULL REFERENCES skill_test_attempts(id) ON DELETE CASCADE,
    question_id INT NOT NULL REFERENCES skill_test_questions(id) ON DELETE CASCADE,
    
    answer_text TEXT,
    is_correct BOOLEAN,
    is_marked_for_review BOOLEAN DEFAULT FALSE,
    time_spent_seconds INT DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(attempt_id, question_id)
);

-- ========================================
-- CREATE INDEXES FOR PERFORMANCE
-- ========================================
CREATE INDEX idx_languages_category ON skill_languages(category_id);
CREATE INDEX idx_tests_language ON skill_tests(language_id);
CREATE INDEX idx_tests_language_level ON skill_tests(language_id, level);
CREATE INDEX idx_modules_test ON skill_test_modules(test_id);
CREATE INDEX idx_questions_test ON skill_test_questions(test_id);
CREATE INDEX idx_questions_module ON skill_test_questions(module_id);
CREATE INDEX idx_attempts_user ON skill_test_attempts(user_id);
CREATE INDEX idx_attempts_test ON skill_test_attempts(test_id);
CREATE INDEX idx_attempts_token ON skill_test_attempts(attempt_token);
CREATE INDEX idx_answers_attempt ON skill_test_answers(attempt_id);

-- ========================================
-- INSERT CATEGORIES (Only clean, single categories)
-- ========================================
INSERT INTO skill_categories (name, description, icon, display_order) VALUES
('Programming', 'Software development and programming languages', 'code', 1),
('Cloud Computing', 'Cloud platforms and DevOps', 'cloud', 2),
('Web Development', 'Frontend and backend development', 'globe', 3),
('Data Science', 'Analytics and machine learning', 'database', 4);

-- ========================================
-- INSERT LANGUAGES FOR PROGRAMMING CATEGORY
-- ========================================
INSERT INTO skill_languages (category_id, name, description, icon, display_order) VALUES
(1, 'Java', 'Object-oriented programming with Java', 'coffee', 1),
(1, 'Python', 'Versatile programming language', 'python', 2),
(1, 'SQL', 'Database queries and management', 'database', 3),
(1, 'C++', 'High-performance programming', 'code', 4),
(1, 'JavaScript', 'Web scripting language', 'javascript', 5);

-- ========================================
-- CREATE ONE EXAM PER LANGUAGE-LEVEL COMBINATION
-- ========================================

-- Get Java language ID
DO $$
DECLARE
    java_lang_id INT;
    python_lang_id INT;
    sql_lang_id INT;
    test_id INT;
    module_mcq_id INT;
    module_fill_id INT;
    module_prog_id INT;
BEGIN
    -- Get language IDs
    SELECT id INTO java_lang_id FROM skill_languages WHERE name = 'Java';
    SELECT id INTO python_lang_id FROM skill_languages WHERE name = 'Python';
    SELECT id INTO sql_lang_id FROM skill_languages WHERE name = 'SQL';
    
    -- ========================================
    -- JAVA EXAMS (4 levels, 1 exam each)
    -- ========================================
    
    -- Java Beginner
    INSERT INTO skill_tests (language_id, level, title, description, duration_minutes, mcq_count, fill_blank_count, programming_count, passing_percentage)
    VALUES (java_lang_id, 'Beginner', 'Java Fundamentals - Beginner', 'Master the basics of Java programming', 60, 10, 5, 10, 60)
    RETURNING id INTO test_id;
    
    -- Create modules
    INSERT INTO skill_test_modules (test_id, name, module_type, display_order) VALUES
    (test_id, 'Module 1: Multiple Choice Questions', 'MCQ', 1) RETURNING id INTO module_mcq_id;
    INSERT INTO skill_test_modules (test_id, name, module_type, display_order) VALUES
    (test_id, 'Module 2: Fill in the Blanks', 'FILL_BLANK', 2) RETURNING id INTO module_fill_id;
    INSERT INTO skill_test_modules (test_id, name, module_type, display_order) VALUES
    (test_id, 'Module 3: Programming Questions', 'PROGRAMMING', 3) RETURNING id INTO module_prog_id;
    
    -- Insert MCQ questions for Java Beginner
    INSERT INTO skill_test_questions (test_id, module_id, question_type, question, option_a, option_b, option_c, option_d, correct_answer, display_order) VALUES
    (test_id, module_mcq_id, 'MCQ', 'What is the size of int data type in Java?', '8 bits', '16 bits', '32 bits', '64 bits', 'C', 1),
    (test_id, module_mcq_id, 'MCQ', 'Which keyword is used to create a class in Java?', 'class', 'Class', 'define', 'create', 'A', 2),
    (test_id, module_mcq_id, 'MCQ', 'What is the default value of boolean in Java?', 'true', 'false', '0', 'null', 'B', 3),
    (test_id, module_mcq_id, 'MCQ', 'Which method is the entry point of a Java program?', 'start()', 'main()', 'run()', 'execute()', 'B', 4),
    (test_id, module_mcq_id, 'MCQ', 'What is the extension of Java source file?', '.class', '.java', '.jar', '.exe', 'B', 5),
    (test_id, module_mcq_id, 'MCQ', 'Which of these is not a Java keyword?', 'static', 'Boolean', 'void', 'private', 'B', 6),
    (test_id, module_mcq_id, 'MCQ', 'What is the output of: System.out.println(10 + 20);?', '1020', '30', 'Error', '10 20', 'B', 7),
    (test_id, module_mcq_id, 'MCQ', 'Which operator is used for string concatenation?', '&', '+', '*', '.', 'B', 8),
    (test_id, module_mcq_id, 'MCQ', 'What is inheritance in Java?', 'Code reusability', 'Polymorphism', 'Encapsulation', 'None', 'A', 9),
    (test_id, module_mcq_id, 'MCQ', 'Which package is imported by default?', 'java.util', 'java.lang', 'java.io', 'java.net', 'B', 10);
    
    -- Insert Fill in the Blanks
    INSERT INTO skill_test_questions (test_id, module_id, question_type, question, correct_answer, display_order) VALUES
    (test_id, module_fill_id, 'FILL_BLANK', 'Java is a _____ programming language.', 'object-oriented', 1),
    (test_id, module_fill_id, 'FILL_BLANK', 'The _____ keyword is used to inherit a class in Java.', 'extends', 2),
    (test_id, module_fill_id, 'FILL_BLANK', 'JVM stands for Java _____ Machine.', 'Virtual', 3),
    (test_id, module_fill_id, 'FILL_BLANK', 'The _____ method is called when an object is created.', 'constructor', 4),
    (test_id, module_fill_id, 'FILL_BLANK', 'Java programs are _____ and platform independent.', 'compiled', 5);
    
    -- Insert Programming questions
    INSERT INTO skill_test_questions (test_id, module_id, question_type, question, starter_code, correct_answer, display_order) VALUES
    (test_id, module_prog_id, 'PROGRAMMING', 'Write a Java program to print "Hello World"', 
     'public class Main {\n    public static void main(String[] args) {\n        // Write your code here\n    }\n}',
     'System.out.println("Hello World");', 1),
    (test_id, module_prog_id, 'PROGRAMMING', 'Write a program to add two numbers (a=10, b=20)',
     'public class Main {\n    public static void main(String[] args) {\n        int a = 10;\n        int b = 20;\n        // Write your code here\n    }\n}',
     'int sum = a + b;\nSystem.out.println(sum);', 2),
    (test_id, module_prog_id, 'PROGRAMMING', 'Create a variable to store your name and print it',
     'public class Main {\n    public static void main(String[] args) {\n        // Write your code here\n    }\n}',
     'String name = "John";\nSystem.out.println(name);', 3),
    (test_id, module_prog_id, 'PROGRAMMING', 'Write a program to check if a number is even',
     'public class Main {\n    public static void main(String[] args) {\n        int num = 10;\n        // Write your code here\n    }\n}',
     'if (num % 2 == 0) {\n    System.out.println("Even");\n}', 4),
    (test_id, module_prog_id, 'PROGRAMMING', 'Create an integer array with 5 elements',
     'public class Main {\n    public static void main(String[] args) {\n        // Write your code here\n    }\n}',
     'int[] arr = {1, 2, 3, 4, 5};', 5),
    (test_id, module_prog_id, 'PROGRAMMING', 'Write a for loop to print numbers 1 to 5',
     'public class Main {\n    public static void main(String[] args) {\n        // Write your code here\n    }\n}',
     'for (int i = 1; i <= 5; i++) {\n    System.out.println(i);\n}', 6),
    (test_id, module_prog_id, 'PROGRAMMING', 'Create a method that returns the sum of two numbers',
     'public class Main {\n    // Write your method here\n    \n    public static void main(String[] args) {\n        System.out.println(add(5, 3));\n    }\n}',
     'public static int add(int a, int b) {\n    return a + b;\n}', 7),
    (test_id, module_prog_id, 'PROGRAMMING', 'Write a program to find maximum of two numbers',
     'public class Main {\n    public static void main(String[] args) {\n        int a = 10, b = 20;\n        // Write your code here\n    }\n}',
     'int max = (a > b) ? a : b;\nSystem.out.println(max);', 8),
    (test_id, module_prog_id, 'PROGRAMMING', 'Create a String variable and convert it to uppercase',
     'public class Main {\n    public static void main(String[] args) {\n        String str = "hello";\n        // Write your code here\n    }\n}',
     'String upper = str.toUpperCase();\nSystem.out.println(upper);', 9),
    (test_id, module_prog_id, 'PROGRAMMING', 'Write a program to calculate factorial of 5',
     'public class Main {\n    public static void main(String[] args) {\n        int n = 5;\n        // Write your code here\n    }\n}',
     'int fact = 1;\nfor (int i = 1; i <= n; i++) {\n    fact *= i;\n}\nSystem.out.println(fact);', 10);
    
    -- Java Intermediate
    INSERT INTO skill_tests (language_id, level, title, description, duration_minutes, mcq_count, fill_blank_count, programming_count, passing_percentage)
    VALUES (java_lang_id, 'Intermediate', 'Java OOP Concepts - Intermediate', 'Deep dive into object-oriented programming', 75, 10, 5, 10, 65);
    
    -- Java Advanced
    INSERT INTO skill_tests (language_id, level, title, description, duration_minutes, mcq_count, fill_blank_count, programming_count, passing_percentage)
    VALUES (java_lang_id, 'Advanced', 'Advanced Java - Collections & Streams', 'Master advanced Java concepts', 90, 10, 5, 10, 70);
    
    -- Java Professional
    INSERT INTO skill_tests (language_id, level, title, description, duration_minutes, mcq_count, fill_blank_count, programming_count, passing_percentage)
    VALUES (java_lang_id, 'Professional', 'Java Professional - Enterprise Development', 'Professional-level Java development', 120, 10, 5, 10, 75);
    
    -- ========================================
    -- PYTHON EXAMS (4 levels, 1 exam each)
    -- ========================================
    
    INSERT INTO skill_tests (language_id, level, title, description, duration_minutes, mcq_count, fill_blank_count, programming_count, passing_percentage)
    VALUES (python_lang_id, 'Beginner', 'Python Basics - Beginner', 'Introduction to Python programming', 60, 10, 5, 10, 60);
    
    INSERT INTO skill_tests (language_id, level, title, description, duration_minutes, mcq_count, fill_blank_count, programming_count, passing_percentage)
    VALUES (python_lang_id, 'Intermediate', 'Python Data Structures - Intermediate', 'Lists, dictionaries, and more', 75, 10, 5, 10, 65);
    
    INSERT INTO skill_tests (language_id, level, title, description, duration_minutes, mcq_count, fill_blank_count, programming_count, passing_percentage)
    VALUES (python_lang_id, 'Advanced', 'Advanced Python - OOP & Modules', 'Advanced Python concepts', 90, 10, 5, 10, 70);
    
    INSERT INTO skill_tests (language_id, level, title, description, duration_minutes, mcq_count, fill_blank_count, programming_count, passing_percentage)
    VALUES (python_lang_id, 'Professional', 'Python Professional - Web & APIs', 'Professional Python development', 120, 10, 5, 10, 75);
    
    -- ========================================
    -- SQL EXAMS (4 levels, 1 exam each)
    -- ========================================
    
    INSERT INTO skill_tests (language_id, level, title, description, duration_minutes, mcq_count, fill_blank_count, programming_count, passing_percentage)
    VALUES (sql_lang_id, 'Beginner', 'SQL Fundamentals - Beginner', 'Basic SQL queries', 60, 10, 5, 10, 60);
    
    INSERT INTO skill_tests (language_id, level, title, description, duration_minutes, mcq_count, fill_blank_count, programming_count, passing_percentage)
    VALUES (sql_lang_id, 'Intermediate', 'SQL Joins & Subqueries - Intermediate', 'Complex SQL operations', 75, 10, 5, 10, 65);
    
    INSERT INTO skill_tests (language_id, level, title, description, duration_minutes, mcq_count, fill_blank_count, programming_count, passing_percentage)
    VALUES (sql_lang_id, 'Advanced', 'Advanced SQL - Optimization', 'Query optimization and performance', 90, 10, 5, 10, 70);
    
    INSERT INTO skill_tests (language_id, level, title, description, duration_minutes, mcq_count, fill_blank_count, programming_count, passing_percentage)
    VALUES (sql_lang_id, 'Professional', 'SQL Professional - Database Design', 'Professional database management', 120, 10, 5, 10, 75);
    
END $$;

-- ========================================
-- VERIFICATION QUERIES
-- ========================================

-- View complete hierarchy
-- SELECT 
--     c.name as category,
--     l.name as language,
--     t.level,
--     t.title,
--     t.total_questions
-- FROM skill_categories c
-- JOIN skill_languages l ON c.id = l.category_id
-- JOIN skill_tests t ON l.id = t.language_id
-- ORDER BY c.display_order, l.display_order, 
--          CASE t.level 
--              WHEN 'Beginner' THEN 1
--              WHEN 'Intermediate' THEN 2
--              WHEN 'Advanced' THEN 3
--              WHEN 'Professional' THEN 4
--          END;

-- Count exams per language
-- SELECT 
--     l.name as language,
--     COUNT(t.id) as exam_count
-- FROM skill_languages l
-- LEFT JOIN skill_tests t ON l.id = t.language_id
-- GROUP BY l.id, l.name
-- ORDER BY l.name;
