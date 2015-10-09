import RPi.GPIO as GPIO
from time import sleep  
from evdev import uinput, ecodes as e

options = {
  'C' : e.KEY_C,
  'N' : e.KEY_N,
  'P' : e.KEY_P,
  'S' : e.KEY_S ,
  '1' : e.KEY_KP1,
  '2' : e.KEY_KP2,
  '3' : e.KEY_KP3,
  '4' : e.KEY_KP4,
  '5' : e.KEY_KP5,
  '6' : e.KEY_KP6,
  '7' : e.KEY_KP7,
  '8' : e.KEY_KP8
}


# BCM numering
GPIO.setmode(GPIO.BCM)

# par défaut voltage haut
GPIO.setup(4, GPIO.IN, pull_up_down=GPIO.PUD_UP)
GPIO.setup(17, GPIO.IN, pull_up_down=GPIO.PUD_UP)
GPIO.setup(27, GPIO.IN, pull_up_down=GPIO.PUD_UP)
GPIO.setup(7, GPIO.IN, pull_up_down=GPIO.PUD_UP)
GPIO.setup(23, GPIO.IN, pull_up_down=GPIO.PUD_UP)
GPIO.setup(24, GPIO.IN, pull_up_down=GPIO.PUD_UP)


# un fil va du GPIO au boutton, et du bouton à la terre

def emitKey(key):
  with uinput.UInput() as ui:
    ui.write(e.EV_KEY, key, 1)
    ui.write(e.EV_KEY, key, 0)
    ui.syn()


# pollin, coûteux en resources
try:  
  while True:  
    sleep(0.5)

    if not GPIO.input(17):
      print("GPIO17")
      emitKey(options['1'])

    if not GPIO.input(4):
      print("GPIO4")
      emitKey(options['2'])

    if not GPIO.input(27):
      print("GPIO27")    
      emitKey(options['2'])

    if not GPIO.input(7):
      print("GPIO7")  
      emitKey(options['P'])

    if not GPIO.input(23):
      print("GPIO23")
      emitKey(options['N'])

    if not GPIO.input(24):
      print("GPIO24")
      emitKey(options['S']) 

except KeyboardInterrupt:          # trap a CTRL+C keyboard interrupt  
  print("end")
