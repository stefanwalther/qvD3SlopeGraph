SlopeGraph for QlikView
================================================================================
The chart type Slopegraph has been invented by Edward Tufte. This solution brings the concept of SlopeGraphs to QlikView using the concept of QlikView Extensions. 
Screenshots
--------------------------------------------------------------------------------
**D3SlopeGraph in Action - Example 1:**  
![Configuration Dialog for D3SlopeGraph QlikView Extension](https://raw.github.com/stefanwalther/D3SlopeGraph/master/gh-pages/images/D3SlopeGraph_Example1.png)  

**D3SlopeGraph in Action - Example 1, hovering a value pair:**  
![Configuration Dialog for D3SlopeGraph QlikView Extension](https://raw.github.com/stefanwalther/D3SlopeGraph/master/gh-pages/images/D3SlopeGraph_Example1_Hovering.png)

**D3SlopeGraph - Configuration Dialog:**  
![Configuration Dialog for D3SlopeGraph QlikView Extension](https://raw.github.com/stefanwalther/D3SlopeGraph/master/gh-pages/images/D3SlopeGraph_Configuration.png)

Configuration & Installation
--------------------------------------------------------------------------------
Installation of the QlikView Extension is straightforward, there is nothing special to take care of:

* [Download the extension](https://github.com/stefanwalther/D3SlopeGraph/raw/master/Install/D3SlopeGraph_Latest.qar)
* [(Download the sample QlikView application)](https://github.com/stefanwalther/D3SlopeGraph/raw/master/Demo/D3SlopeGraph_v1.0.0.qvw)
* Install the extension on your local computer (doubleclick the .qar file)
* Drag’n’Drop the extension within QlikView Desktop (using WebView)
* Finally deploy the extension to your server (&#8594; [detailed instruction](http://www.qlikblog.at/1597/qliktip-40-installingdeploying-qlikview-extensions/))

### Configuration
The table below explains the properties available for configuring the behavior of this extension:

| Property         | Type          | Description                                 |
| ---------------- | ------------- | ------------------------------------------- |
|  **Dimension**   |  AlphaNumeric | The dimension for the Slope Graph Chart     |
|  **Value 1**     |  Numeric      | Numeric value for the value on the **left** |
|  **Value 2**     |  Numeric      | Numeric value for the value on the **right**|
|  **Title Left**  |  AlphaNumeric | Left Title (default: blank)                 |
|  **Title Right** |  AlphaNumeric | Right Title (default: blank)                |
|  **Plot Height** |  Numeric 	 | Plotting Area height in pixel for sixing the plotting area independently from the extension's height (default: -1)                |


Additional Information
--------------------------------------------------------------------------------

### Compatibility
Tested and developed for the following systems:

* Windows 7, Windows 8, Windows 2012
* You'll need a modern browser which supports SVG
* QlikView 11 SR2+, QlikView 11.2

### Change Log

* **Version 1.0.0** - 01/01/2014  
  * Initial Release 

### Issues & Code-Contributions
Code contributions are very welcome.
If you have any issues, please post them on GitHub.

### License
> The software is made available "AS IS" without any warranty of any kind under the MIT License (MIT).
> Since this is a private project QlikTech support agreement does not cover support for this software.

[&#8594; Full License statement + list of components used for this solution.](LICENSE.md)
