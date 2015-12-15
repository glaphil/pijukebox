# Raspberry pi Jukebox based on Subsonic
## Software Preparation
- install raspbian on sd card : https://www.raspberrypi.org/documentation/installation/installing-images/linux.md
- install subsonic : http://subsonic.org
    - don't forget to buy a licence, else api won't be accesible after 30 days
- go to subsonic web app (http://localhost:4040), log in with default user (admin/admin)
    - set your media music direcory
    - copy your songs on that directory (or use ui to upload it)
        - 1 directory per song to be able to download the cover picture
    - create a playlist "myjukebox" (or change that name in client app too), and your songs to that playlist
- install iceweasel browser : sudo apt-get install iceweasel
- install the python libs 
    - sudo apt-get install libudev-dev
    - sudo pip3 install python-uinput
    - sudo pip3 install evdev (I don't remember if it's still usefull in last version of the python buttons handler script)
- install pigpio http://abyz.co.uk/rpi/pigpio/download.html
    - wget abyz.co.uk/rpi/pigpio/pigpio.zip
    - unzip pigpio.zip
    - cd PIGPIO
    - make
    - sudo make install
 
## Launch
- load uinput python module
    - sudo modprobe uinput
- launche pigpio
    - sudo pigpiod
- launche python script to handle buttons
    - go to python directory of the cloned project
    - sudo python3 buttonsToKeysWithCallbacksPigPio.py
- launch iceweasel and open index.html located at the root directory of the cloned project

## Hardware stuff
- too long to explain here but nothing really complicated 
    - look at the pictures of my blog post and figure out yourself how to build :D (or get in touch)
    - for wiring : have a look at the python script, you'll find buttons bcm gpio mappings (INSERT_COIN = 4, PREVIOUS = 17, ...)
- nb : you need to plug a mouse and keyboard

## known problems
- buttons doesn't work
    - did you enable numlock ?
    - interact with the app with the keyboard (type h to get help on the keys) and log press event to js console, check if it correspond to the one emited by the buttons in the python script
    
## Todos 
- Script to launch everything on startup (no need to plug a mouse or keyboard)
- Implement cheat codes to get 'free' songs (by pressing buttons sequence)
- Debug the jukebox shutdown (commented in the python script, a press for more than 5 seconds on stop should shutdown)
- Client app for Spotify and Deezer API
- ...
- 

