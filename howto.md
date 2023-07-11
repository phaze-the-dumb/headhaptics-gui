# How To Build ( WIP )

This documentation is very scuffed, I am very sorry, If you need more help building this dm me on discord `_phaz`.

## What you need

(Prices are guessed and may vary depending on source, most of these were from aliexpress)

Required
- Your own VRChat avatar, or not if you're willing to write your own drivers.
- £1.53 - Haptic Motors ( The £1.53 is the price I paid for 10 of them )
- £7.20 - 1x Pi Pico WH ( Or a Pi Pico H slightly cheaper but will need a usb cable to connect the board and your pc )
- £0.29 - 1x Motor Driver Board ( MX1508 - doesn't need to be *this* particular board, but it's the one i'm using )
- £2.00 - A Breadboard
- £0.50 - Breadboard Jumper Wires
- £0.75 - AA 2x Battery Holder

Optional
- A Switch  ( Don't need if battery holder already has one )
- Pack of LEDs ( Just for power indication, found to be useful, recommended to be used with a resistor )

Tools N Stuff
- Soldering Iron ( and solder )
- Some sort of tape ( cellotape or electrical tape work fine )

## Prerequisites

Make sure that you have a way of mounting the haptic motors and pi to your head. Most bobovr headstraps come with little arch thingies that you can attach the haptic motors too.

![](https://i.phazed.xyz/bQgO4aNqQ9VGV.png)

**Note: In this image I have placed the haptic motors on top of the arches, I have now moved them to below since they work better there.**

<hr />

Solder jumper wires onto:
- 2 Haptic Motors ( make sure they work first, especially if you bought them in bulk for cheap )
- The battery pack ( obviously, don't if it already has wires that fit into a breadboard )

<hr />

Install [kaluma's uf2 file](https://kalumajs.org/download/) onto the pi pico, you can do this buy:
- Unplugging the pico from your pc
- Holding down the button on it
- Plugging it back into your pc
- This should show a folder called "RPI-RPI2" or something I can't remember 💀
- Drag the .UF2 file into the folder
- Your pico should restart with the software installed

## How to build it

Yes I know, its litterally the worst diagram ever. I need to draw it out better at some point.

![](https://i.phazed.xyz/IqwOtd3hNZlwt.png)

The basic idea:
- Connect the GPIO pin 2 to in4 on the driver board
- Connect the GPIO pin 3 to in2 on the driver board
- Connect in1 & in3 on the driver board to the ground
- Connect the Pi Pico's ground to the ground of the batteries
- Motor-A on the driver board is the left haptic motor
- Motor-B on the driver board is the right haptic motor

## Software

To use this download [the latest release from this repo](https://github.com/phaze-the-dumb/headhaptics-gui/releases/latest) and run the executable

Open unity with your vrchat avatar and add two "VRChat contact recivers" on both sides of your head

![](https://i.phazed.xyz/r9yhY77FL6T8M.png)

Even better: If your avatar has ears like mine you can add the contact recivers to those.

Here's the configuration for the contact recivers

![](https://i.phazed.xyz/PB*0GrJXrbpy4.png)

The parameters need to be `LContact` for the left reciver and `RContact` for the right reciver

Under the FX Animator you need to add two `float` parameters ( I think, if i'm wrong, tell me please )

- `LContact`
- `RContact`

Then in your expression parameters you need to add 3 values

- `LContact`
- `RContact`
- `HapticsMultiplier` - doesn't need to be synced

**These are all floats**

Add a radial puppet in the expressions menu that changes the value `HapticsMultiplier`

You should be all done!

**Note: If it doesn't work first try you might need to delete the OSC Config file for your avatar in `AppData\LocalLow\VRChat\VRChat\OSC\<USER_ID>\Avatars`**

## Going further

You thought this was complicated enough didn't you, but we can go further!

If you are happy with that you already have you can stop here, but if you want more control over your vrchat osc inputs / outputs i have intergrated this into one of my longer standing projects [VRCOSCS](https://github.com/phaze-the-dumb/VRCOSCS)

You can use the haptics with this code:

```yml
- OSC Actions:
    - LeftEarHaptics:
        - OSC: /avatar/parameters/LContact
        - LeftHaptics: [[VALUE]]

    - RightEarHaptics:
        - OSC: /avatar/parameters/RContact
        - RightHaptics: [[VALUE]]

    - HapticsStrength:
        - OSC: /avatar/parameters/HapticsMultiplier
        - HapticsStrength: [[VALUE]]

- Events:
    - Start:
        - Hook: Start
        - OpenHaptics: DEVICE PATH
        - LeftHaptics: 0
        - RightHaptics: 0
```

To get your device path ( on windows ), you can run the command `mode` and it will list all the the devices, you shouldn't have too many here so you can go through and test each one.