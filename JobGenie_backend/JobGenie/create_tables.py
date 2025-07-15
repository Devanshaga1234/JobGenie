from connect_db import get_connection

def main():
    conn = get_connection()

    cursor = conn.cursor()

    # try:
    #     cursor.execute("""
    #     CREATE TABLE IF NOT EXISTS `User` (
    #         UserID INT AUTO_INCREMENT PRIMARY KEY,
    #         Email VARCHAR(255) UNIQUE NOT NULL,
    #         Name VARCHAR(255) NOT NULL,
    #         Resume TEXT,
    #         Preferences TEXT
    #     );
    #     """)

    #     cursor.execute("""
    #     CREATE TABLE IF NOT EXISTS Job (
    #         JobID INT AUTO_INCREMENT PRIMARY KEY,
    #         Title VARCHAR(255) NOT NULL,
    #         Company VARCHAR(255),
    #         Location VARCHAR(255),
    #         Salary DECIMAL(10,2),
    #         Description TEXT,
    #         Source VARCHAR(255)
    #     );
    #     """)

    #     cursor.execute("""
    #     CREATE TABLE IF NOT EXISTS Application (
    #         ApplicationID INT AUTO_INCREMENT PRIMARY KEY,
    #         UserID INT NOT NULL,
    #         JobID INT NOT NULL,
    #         Status VARCHAR(50) NOT NULL CHECK (Status IN ('Pending', 'Accepted', 'Rejected')),
    #         AppliedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    #         FOREIGN KEY (UserID) REFERENCES `User`(UserID) ON DELETE CASCADE,
    #         FOREIGN KEY (JobID) REFERENCES Job(JobID) ON DELETE CASCADE
    #     );
    #     """)

    #     cursor.execute("""
    #     CREATE TABLE IF NOT EXISTS Notification (
    #         NotificationID INT AUTO_INCREMENT PRIMARY KEY,
    #         UserID INT NOT NULL,
    #         JobID INT NOT NULL,
    #         ApplicationID INT NOT NULL,
    #         Status VARCHAR(255) NOT NULL,
    #         SentAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    #         FOREIGN KEY (UserID) REFERENCES `User`(UserID) ON DELETE CASCADE,
    #         FOREIGN KEY (JobID) REFERENCES Job(JobID) ON DELETE CASCADE,
    #         FOREIGN KEY (ApplicationID) REFERENCES Application(ApplicationID) ON DELETE CASCADE
    #     );
    #     """)

    #     cursor.execute("""
    #     CREATE TABLE IF NOT EXISTS JobMatch (
    #         MatchID INT AUTO_INCREMENT PRIMARY KEY,
    #         UserID INT NOT NULL,
    #         JobID INT NOT NULL,
    #         MatchScore DECIMAL(5,2) NOT NULL,
    #         Timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    #         FOREIGN KEY (UserID) REFERENCES `User`(UserID) ON DELETE CASCADE,
    #         FOREIGN KEY (JobID) REFERENCES Job(JobID) ON DELETE CASCADE
    #     );
    #     """)

    #     cursor.execute("""
    #     CREATE TABLE IF NOT EXISTS UserJob (
    #         UserID INT NOT NULL,
    #         JobID INT NOT NULL,
    #         PRIMARY KEY (UserID, JobID),
    #         FOREIGN KEY (UserID) REFERENCES `User`(UserID) ON DELETE CASCADE,
    #         FOREIGN KEY (JobID) REFERENCES Job(JobID) ON DELETE CASCADE
    #     );
    #     """)
        # Alter Application table to add NotificationID column and FK
    try:
        cursor.execute("""
        ALTER TABLE Application
        ADD COLUMN NotificationID INT NOT NULL,
        ADD CONSTRAINT FK_Application_Notification
            FOREIGN KEY (NotificationID) REFERENCES Notification(NotificationID) ON DELETE CASCADE;
        """)
    except Exception as e:

        conn.commit()


    except Exception as e:
        pass

    cursor.close()
    conn.close()


if __name__ == "__main__":
    main()
