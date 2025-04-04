CREATE DATABASE BlogCaNhan;
USE BlogCaNhan;
-- Tạo bảng Accounts
CREATE TABLE Accounts (
    account_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    pass VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone_number VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tạo bảng Users
CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    account_id INT NOT NULL UNIQUE,
    full_name VARCHAR(255),
    address TEXT,
    avatar VARCHAR(255),
    date_of_birth DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (account_id) REFERENCES Accounts(account_id)
);
CREATE TABLE Authorities (
  authority_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  authority VARCHAR(50) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);
-- Tạo bảng Posts
CREATE TABLE Posts (
    post_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

-- Tạo bảng PostDetails
CREATE TABLE PostDetails (
    details_post_id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,
    title VARCHAR(255),
    content TEXT,
    image VARCHAR(255),
    `order` INT,
    FOREIGN KEY (post_id) REFERENCES Posts(post_id)
);

-- Tạo bảng Likes
CREATE TABLE Likes (
    like_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    post_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (post_id) REFERENCES Posts(post_id)
);

-- Tạo bảng Comments
CREATE TABLE Comments (
    comment_id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,
    user_id INT NOT NULL,
    parent_id INT,
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES Posts(post_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (parent_id) REFERENCES Comments(comment_id)
);


-- Insert data into Accounts
INSERT INTO Accounts (username, pass, email, phone_number) 
VALUES
    ('user1', 'password123', 'user1@example.com', '0123456789'),
    ('user2', 'password456', 'user2@example.com', '0987654321'),
    ('user3', 'password789', 'user3@example.com', '1234567890');

INSERT INTO Users (account_id, full_name, address, avatar, date_of_birth)
VALUES
  (1, 'John Doe', '123 Main St, Anytown, CA 12345', 'https://example.com/avatar1.jpg', '1990-01-01'),
  (2, 'Jane Smith', '456 Elm St, Anytown, CA 12345', 'https://example.com/avatar2.jpg', '1991-02-02'),
  (3, 'Alice Wonder', '789 Maple St, Anytown, CA 12345', 'https://example.com/avatar3.jpg', '1992-03-03');

insert into Authorities(user_id, authority)
values
(1, 'admin'),
(2, 'user'),
(3, 'user');


INSERT INTO Posts (user_id, title, content)
VALUES
  (1, 'First Post', 'This is the content of the first post.'),
  (2, 'Second Post', 'This is the content of the second post.'),
  (3, 'Third Post', 'This is the content of the third post.');


INSERT INTO PostDetails (post_id, title, content, image, `order`)
VALUES
  (1, 'Chi tiết 1 của bài đăng 1', 'Nội dung chi tiết 1', 'image1.jpg', 1),
  (1, 'Chi tiết 2 của bài đăng 1', 'Nội dung chi tiết 2', 'image2.jpg', 2),
  (2, 'Chi tiết duy nhất của bài đăng 2', 'Nội dung chi tiết', 'image3.jpg', 1),
  (3, 'Tiêu đề con 1', 'Nội dung con 1', NULL, 1),
  (3, 'Tiêu đề con 2', 'Nội dung con 2', NULL, 2);
  

INSERT INTO Likes (user_id, post_id)
VALUES
  (3, 1),
  (1, 3),
  (2, 3);
  
INSERT INTO Comments (post_id, user_id, content, parent_id)
VALUES
  (1, 2, 'Great post, John!', NULL),
  (2, 3, 'Nice article, Jane!', NULL),
  (3, 1, 'Well written, Bob!', NULL);