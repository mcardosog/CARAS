# CARAS

**CARAS** is a web app created using nodejs, react, firebase and tensorflow. This app manages organization events registration (check in) using company users face as the main factor of authentication.


# USAGE

## How it works?

**CARAS** uses in the backend the **faceapi.js** (https://github.com/justadudewhohacks/face-api.js/) With the user of this API the app is able to recognize an user face, age and gender. With the user of this parameters the app is able to provide access to an event to a certain user. All the information is stored in **Firebase** encrypted.  

## How to start using it?

First an organization must me registered. After the admin portal will allow to the organization admin to manage events and users. Users information, gender, age, email, name, id and level must be provided, then the admin will proceed to capture the user face landmarks. 
To setup an event, admins will provide minimum level, allowed users (in case that an user that does not satisfy the level requirement is allowed into the event) and notAllowed users (opposite of allowed users). Additionally an event passcode must be entered. Once the event goes active, the admin must setup the station providing the organization id and the event passcode. Later on, users will encounter a simple interface where they have to entered their user id, and capture a photo using the webcam of the device to start the face recognition. After this the system will provide feedback to the user about their allowance status. 

# FILES

- /src/FaceRecognition/
	>  Control that allows the facerecognition. Control needs organization id and event id. This control must be used only if the event and organization were verified. 	After the user is authenticated user attendance is recorded.

- /src/Recognizer/
	>  Control that contains FaceRecognition control. This control needs to validate organization, event and event passcode before calling the FaceRecognition control.
	
- /src/Firebase/
	>  Control that handle all the database managment.	
