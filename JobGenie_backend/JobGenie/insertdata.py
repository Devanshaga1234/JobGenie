import pandas as pd
import mysql.connector
from connect_db import get_connection
import random
import re
import names


def parse_salary(ctc_str):
    try:
        if '$' in str(ctc_str):
            ctc_str.replace('$', '').replace(',', '')
            list = ctc_str.split('-')
            sum = 0
            if len(list) >= 2:
                for i in range(0, len(list)):
                    sum += (float(list[i]))
                return sum / len(list)
            elif len(list) == 1:
                return float(list[0])
            else:
                return 0
    except:
        return None
    return None

def clean_name(text):
    return names.get_full_name()

def generate_email(name, i):
    parts = name.lower().strip().split(' ')
    if len(parts) == 1:
        return parts[0] + str(random.randint(100,999)) + "@gmail.com"
    return parts[0] + "." + parts[1] + str(random.randint(100,999)) + "@gmail.com"

def insert_jobs(csv_path, conn):

    df = pd.read_csv(csv_path, skiprows = 1, on_bad_lines = 'skip',  sep=",",engine='python')
    print(df.columns)
    df = df.fillna('')
    cursor = conn.cursor()


    
    df = df.head(1000).reset_index(drop=True)
    for i, row in df.head(1000).iterrows():
        try:
            title = row.get('job_title', 'Unknown')
            company = row.get('company_name', 'Unknown')
            location = row.get('location', 'Unknown')
            salary = parse_salary(row.get('ctc', ''))
            description = f"Start date: {row.get('start_date', '')} | Experience: {row.get('experience', '')}"
            source = row.get('posted', '')
            sql_query = """INSERT INTO Job (Title, Company, Location, Salary, Description, Source)
                          VALUES (%s, %s, %s, %s, %s, %s)"""
            cursor.execute(sql_query, (title, company, location, salary, description, source))
        except Exception as e:

            pass

    conn.commit()


def insert_users_and_apps(csv_path, conn):
    with open("JOB.CSV", "rb") as f:

        pass
    df = pd.read_csv(csv_path, on_bad_lines='skip', skiprows= 1, engine='python')

    df = df.fillna('')
    cursor = conn.cursor()



    for i, row in df.head(1000).iterrows():
        try:
            name = clean_name(row.get('career_objective', ''))
            email = generate_email(name, i)
            resume = row.get('career_objective', '')
            raw_skills = row.get('skills', '[]')
            if isinstance(raw_skills, str):
                try:
                    skill_list = eval(raw_skills)
                    preferences = ', '.join(skill_list) if isinstance(skill_list, list) else ''
                except:
                    preferences = ''
            else:
                preferences = ''

            sql_user = """INSERT IGNORE INTO `User` (Email, Name, Resume, Preferences)
                         VALUES (%s, %s, %s, %s)"""
            cursor.execute(sql_user, (email, name, resume, preferences))

            user_id = cursor.lastrowid
            if user_id == 0:
                cursor.execute("SELECT UserID FROM `User` WHERE Email = %s", (email,))
                result = cursor.fetchone()
                if result:
                    user_id = result[0]
                else:
                    # print(f"⚠️ Could not retrieve UserID for {email}")
                    continue

            job_id = (i % 1000) + 1

            sql_notify = """INSERT INTO Notification (UserID, JobID, Status)
                            VALUES (%s, %s, %s)"""
            cursor.execute(sql_notify, (user_id, job_id, 'Sent'))
            notification_id = cursor.lastrowid
            if not notification_id:
                # print(f"⚠️ Failed to insert Notification for user {user_id}, job {job_id}")
                continue

            sql_app = """INSERT INTO Application (UserID, JobID, Status, NotificationID)
                        VALUES (%s, %s, %s, %s)"""
            cursor.execute(sql_app, (user_id, job_id, 'Pending', notification_id))

        except Exception as e:
            pass

    conn.commit()


def insert_job_matches(conn):
    cursor = conn.cursor()

    max_job_id = 1000
    for user_id in range(1, 1001):
        
        job_id = (user_id % max_job_id) + 1
        match_score_high = round(random.uniform(0.8, 1.0), 2)
        sql_high = """INSERT INTO JobMatch (UserID, JobID, MatchScore)
                     VALUES (%s, %s, %s)"""
        cursor.execute(sql_high, (user_id, job_id, match_score_high))

        job_id = random.randint(1, 1000)
        match_score_low = round(random.uniform(0.5, 0.79), 2)
        sql_low = """INSERT INTO JobMatch (UserID, JobID, MatchScore)
                    VALUES (%s, %s, %s)"""
        cursor.execute(sql_low, (user_id, job_id, match_score_low))

    conn.commit()


def main():
    conn = get_connection()
    insert_jobs("job.csv", conn)
    insert_users_and_apps("resume_data.csv", conn)
    insert_job_matches(conn)
    conn.close()


if __name__ == "__main__":
    main()
