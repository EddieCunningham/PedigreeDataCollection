
from flask import *
from flask import current_app
from datetime import datetime

main = Blueprint('main', __name__, template_folder='views')

# Main route
@main.route('/')
def main_route():

	options = {
	}

	return render_template("main.html",**options)


@main.route('/save', methods=['POST'])
def save_route():

	data = json.loads(json.dumps(request.data))

	for i, word in enumerate(data.split("{")):
		if(i==1):
			fileName = word.split("}")[0].split(",")[0].split(":")[1][1:-1]
			break

	fileName = "pedigreeData/"+fileName+".json"

	with open(fileName, 'w') as outfile:
		json.dump(request.data, outfile)

	return ""

