import RPi.GPIO as GPIO
from time import sleep  

# on numérote les PINs dans l'ordre de leur disposition
GPIO.setmode(GPIO.BOARD)

# par défaut voltage haut
GPIO.setup(7, GPIO.IN, pull_up_down=GPIO.PUD_UP)

# un fil va du GPIO au boutton, et du bouton à la terre

# pollin, coûteux en resources
try:  
  while True:  
    sleep(0.5)

    if GPIO.input(7):               
      print("button up, gpio HIGH")
    else:
      print("button down, gpio DOWN") 

except KeyboardInterrupt:          # trap a CTRL+C keyboard interrupt  
  print("end")





# One of the main reasons why wiring buttons and logic to GND is favoured (and then copied all over the internet) is because of power optimization.
#    Pulling a pin LOW with resistor to GND costs 0 watts.
#    Pulling a pin HIGH with resistor to +Vcc costs power.
# On complex circuits or circuits that rely on batteries this power is very precious.
# Other reasons include low EMF generation. On Wireless devices pulling logic high will cause unnecessary cross talk on extremely sensitive RF receivers. 
# On such transceivers there is a GND plane used to filter noise and this is where all logic gets pulled down to. The processor then uses the GND plane to filter switching noises.
