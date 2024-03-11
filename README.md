# CS305.Project.T08

## Steps to Initialize

1. **Clone the Repository:**
   ```bash
   git clone <repository_url>
2. **Install Django if not already installed:**
   ```bash
   pip install django

3. **Navigate to the Backend and Create and Activate a Virtual Environment:**
    ```bash
    cd Backend
    python -m venv env1
    ./env1/Scripts/activate

4. **Install Requirements:**
    ```bash
    pip install -r requirements.txt   

5. **Make Migrations:**
    ```bash
    python manage.py makemigrations
    python manage.py migrate 

    In case of conflicts: Delete migrations all files and folders from /Backend/HandymanHive/migrations except __init__.py and run above commands again.

4. **Run Backend**
    ```bash
    python manage.py runserver
5. **Navigate to App folder to install frontend dependencies**
    ```bash
    cd zappfix
    npm i
6. **Run App**
    ```bash
    npx expo start