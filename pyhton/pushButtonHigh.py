import RPi.GPIO as GPIO
from time import sleep  

# on numérote les PINs dans l'ordre de leur disposition
GPIO.setmode(GPIO.BOARD)

# par défaut voltage bas
GPIO.setup(7, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)

# un fil va du 3.3v au boutton
# et l'autre du bouton au pin du gpio

# pollin, coûteux en resources
try:  
  while True:  
    sleep(0.5)
    if GPIO.input(7):               
      print("button down, gpio HIGH")
    else:
      print("button up, gpio DOWN")

except KeyboardInterrupt: 
  print("end")



# One of the main reasons why wiring buttons and logic to GND is favoured (and then copied all over the internet) is because of power optimization.
#    Pulling a pin LOW with resistor to GND costs 0 watts.
#    Pulling a pin HIGH with resistor to +Vcc costs power.
# On complex circuits or circuits that rely on batteries this power is very precious.
# Other reasons include low EMF generation. On Wireless devices pulling logic high will cause unnecessary cross talk on extremely sensitive RF receivers. On such transceivers there is a GND plane used to filter noise and this is where all logic gets pulled down to. The processor then uses the GND plane to filter switching noises.
