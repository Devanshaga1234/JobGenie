from connect_db import get_connection

def main():
    print("🔌 Connecting to GCP MySQL...")
    conn = get_connection()
    print("✅ Connected!")

    cursor = conn.cursor()

    print("📦 Creating tables...")

    try:
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS User (
            UserID INT AUTO_INCREMENT PRIMARY KEY,
            Email VARCHAR(255) UNIQUE NOT NULL,
            Name VARCHAR(255) NOT NULL,
            Resume TEXT,
            Preferences TEXT
        );
        """)
        print("🧑‍💼 Created User table.")

        cursor.execute("""
        CREATE TABLE IF NOT EXISTS Job (
            JobID INT AUTO_INCREMENT PRIMARY KEY,
            Title VARCHAR(255) NOT NULL,
            Company VARCHAR(255),
            Location VARCHAR(255),
            Salary DECIMAL(10,2),
            Description TEXT,
            Source VARCHAR(255)
        );
        """)
        print("💼 Created Job table.")

        cursor.execute("""
        CREATE TABLE IF NOT EXISTS JobMatch (
            MatchID INT AUTO_INCREMENT PRIMARY KEY,
            UserID INT NOT NULL,
            JobID INT NOT NULL,
            MatchScore DECIMAL(5,2) NOT NULL,
            Timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (UserID) REFERENCES User(UserID) ON DELETE CASCADE,
            FOREIGN KEY (JobID) REFERENCES Job(JobID) ON DELETE CASCADE
        );
        """)
        print("🔗 Created JobMatch table.")

        cursor.execute("""
        CREATE TABLE IF NOT EXISTS Application (
            ApplicationID INT AUTO_INCREMENT PRIMARY KEY,
            UserID INT NOT NULL,
            JobID INT NOT NULL,
            Status VARCHAR(50) NOT NULL CHECK (Status IN ('Pending', 'Accepted', 'Rejected')),
            AppliedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (UserID) REFERENCES User(UserID) ON DELETE CASCADE,
            FOREIGN KEY (JobID) REFERENCES Job(JobID) ON DELETE CASCADE
        );
        """)
        print("📨 Created Application table.")

        cursor.execute("""
        CREATE TABLE IF NOT EXISTS Notification (
            NotificationID INT AUTO_INCREMENT PRIMARY KEY,
            UserID INT NOT NULL,
            JobID INT NOT NULL,
            Status VARCHAR(255) NOT NULL,
            SentAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (UserID) REFERENCES User(UserID) ON DELETE CASCADE,
            FOREIGN KEY (JobID) REFERENCES Job(JobID) ON DELETE CASCADE
        );
        """)
        print("🔔 Created Notification table.")

        conn.commit()
        print("✅ All tables committed.")

    except Exception as e:
        print("❌ Error creating tables:", e)

    cursor.close()
    conn.close()
    print("🔒 Connection closed.")

if __name__ == "__main__":
    main()
