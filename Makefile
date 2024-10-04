venv-activate: 
	.\.venv\Scripts\activate

venv-deactivate:
	deactivate

run:
	python main.py

req-update: 
	pip freeze > requirements.txt

req-install: requirements.txt
	pip install -r requirements.txt