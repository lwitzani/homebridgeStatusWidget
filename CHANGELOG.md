I try to list the changes i make in this changelog:

#16.11.2020 22:24
- added support for entering credentials via widget parameter
- parameter must have the format like admin,,mypassword123,,http://192.168.178.33:8581
- added some concrete error information that should help setting up the widget

#16.11.2020 20:39
- added support for notifications when some status changed
- supported: Homebridge stopped, Homebridge Update available, Plugin Update available, Node.js Update available
- new screenshots
- added changelog
- some filemanager usage refactoring

#15.11.2020 14:26
- overhaul of the status icons, now not using emoji anymore but SFSymbols
- more handling when some requests return undefined
- new screenshots


#15.11.2020 11:25
- fixed the black text color when user uses light mode (now text is always white)
- added unknown status if API requests return undefined
- now user can choose between default purple background and a black background
- now user can set the icons used at a central spot


#14.11.2020 21:44
- added possibility to switch the file manager to local via a variable


#14.11.2020 21:26
- added support to show temperature in Fahrenheit
- more version infos


#14.11.2020 20:48
- just added some infos about the versions of all the systems


#14.11.2020 20:36
- fixed a critical bug (forgot to include the logic for node.js UTD)


#14.11.2020 18:16
- initial commit of the first version of the script