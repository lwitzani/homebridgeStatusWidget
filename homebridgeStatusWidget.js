// Check the readme at https://github.com/lwitzani/homebridgeStatusWidget for setup instructions, troubleshoots and also for updates of course!
// *********
// For power users:
// I added a configuration mechanism so you don't need to reconfigure it every time you update the script!
// Please check the readme for instructions on how to use the persist mechanism for the configuration
let configurationFileName = 'purple.json' // change this to an own name e.g. 'configBlack.json' . This name can then be given as a widget parameter in the form 'USE_CONFIG:yourfilename.json' so you don't loose your preferred configuration across script updates (but you will loose it if i have to change the configuration format)
const usePersistedConfiguration = true; // false would mean to use the visible configuration below; true means the state saved in iCloud (or locally) will be used
const overwritePersistedConfig = false; // if you like your configuration, run the script ONCE with this param to true, then it is saved and can be used via 'USE_CONFIG:yourfilename.json' in widget params
// *********

const CONFIGURATION_JSON_VERSION = 2; // never change this! If i need to change the structure of configuration class, i will increase this counter. Your created config files sadly won't be compatible afterwards.
// CONFIGURATION //////////////////////
class Configuration {
    // you must at least configure the next 3 lines to make this script work or use credentials in parameter when setting up the widget (see the readme on github)
    // if you don't use credentials, just enter the URL and it should work
    // as soon as credentials + URL are correct, a configuration is saved and then used. to make changes after that set overwritePersistedConfig to true
    hbServiceMachineBaseUrl = '>enter the ip with the port here<'; // location of your system running the hb-service, e.g. http://192.168.178.33:8581
    userName = '>enter username here<'; // username of administrator of the hb-service
    password = '>enter password here<'; // password of administrator of the hb-service
    notificationEnabled = true; // set to false to disable all notifications

    notificationIntervalInDays = 1; // minimum amount of days between the notification about the same topic; 0 means notification everytime the script is run (SPAM). 1 means you get 1 message per status category per day (maximum of 4 messages per day since there are 4 categories). Can also be something like 0.5 which means in a day you can get up to 8 messages
    disableStateBackToNormalNotifications = true; // set to false, if you want to be notified e.g. when Homebridge is running again after it stopped
    fileManagerMode = 'ICLOUD'; // default is ICLOUD. If you don't use iCloud Drive use option LOCAL
    temperatureUnitConfig = 'CELSIUS'; // options are CELSIUS or FAHRENHEIT
    requestTimeoutInterval = 2; // in seconds; If requests take longer, the script is stopped. Increase it if it doesn't work or you
    pluginsOrSwUpdatesToIgnore = []; // a string array; enter the exact npm-plugin-names e.g. 'homebridge-fritz' or additionally 'HOMEBRIDGE_UTD' or 'NODEJS_UTD' if you do not want to have them checked for their latest versions
    adaptToLightOrDarkMode = true; // if one of the purple or black options is chosen, the widget will adapt to dark/light mode if true
    bgColorMode = 'PURPLE_LIGHT'; // default is PURPLE_LIGHT. Other options: PURPLE_DARK, BLACK_LIGHT, BLACK_DARK, CUSTOM (custom colors will be used, see below)
    customBackgroundColor1_light = '#3e00fa'; // if bgColorMode CUSTOM is used a LinearGradient is created from customBackgroundColor1_light and customBackgroundColor2_light
    customBackgroundColor2_light = '#7a04d4'; // you can use your own colors here; they are saved in the configuration
    customBackgroundColor1_dark = '#3e00fa'; // if bgColorMode CUSTOM together with adaptToLightOrDarkMode = true is used, the light and dark custom values are used depending on the active mode
    customBackgroundColor2_dark = '#7a04d4';
    chartColor_light = '#FFFFFF'; // _light is the default color if adaptToLightOrDarkMode is false
    chartColor_dark = '#FFFFFF';
    fontColor_light = '#FFFFFF'; // _light the default color if adaptToLightOrDarkMode is false
    fontColor_dark = '#FFFFFF';
    failIcon = '❌';
    bulletPointIcon = '🔸';
    decimalChar = ','; // if you like a dot as decimal separator make the comma to a dot here
    jsonVersion = CONFIGURATION_JSON_VERSION; // do not change this
    enableSiriFeedback = true; // when running script via Siri, she should speak the text that is defined below BUT might be bugged atm, i wrote the dev about it
    homebridgeTitle = 'Homebridge'; // Title to be shown in widget

// logo is downloaded only the first time! It is saved in iCloud and then loaded from there everytime afterwards
    logoUrl = 'https://github.com/homebridge/branding/blob/master/logos/homebridge-silhouette-round-white.png?raw=true';

    // icons:
    icon_statusGood = 'checkmark.circle.fill'; // can be any SFSymbol
    icon_colorGood = '#' + Color.green().hex; // must have form like '#FFFFFF'
    icon_statusBad = 'exclamationmark.triangle.fill'; // can be any SFSymbol
    icon_colorBad = '#' + Color.red().hex;// must have form like '#FFFFFF'
    icon_statusUnknown = 'questionmark.circle.fill'; // can be any SFSymbol
    icon_colorUnknown = '#' + Color.yellow().hex; // must have form like '#FFFFFF'

    // internationalization:
    status_hbRunning = 'Running';
    status_hbUtd = 'UTD';
    status_pluginsUtd = 'Plugins UTD  '; // maybe add spaces at the end if you see '...' in the widget
    status_nodejsUtd = 'Node.js UTD  ';
    // if you change the descriptions in the status columns, you must adapt the spacers between the columns, so that it looks good again :)
    spacer_beforeFirstStatusColumn = 8;
    spacer_betweenStatusColumns = 5;
    spacer_afterSecondColumn = 0;

    title_cpuLoad = 'CPU Load: ';
    title_cpuTemp = 'CPU Temp: ';
    title_ramUsage = 'RAM Usage: ';
    title_uptimes = 'Uptimes:';

    title_uiService = 'UI-Service: ';
    title_systemGuiName = 'Raspberry Pi: '; // name of the system your service is running on

    notification_title = 'Homebridge Status changed:';
    notification_expandedButtonText = 'Show me!';
    notification_ringTone = 'event'; // all ringtones of Scriptable are possible: default, accept, alert, complete, event, failure, piano_error, piano_success, popup


    notifyText_hbNotRunning = 'Your Homebridge instance stopped 😱';
    notifyText_hbNotUtd = 'Update available for Homebridge 😎';
    notifyText_pluginsNotUtd = 'Update available for one of your Plugins 😎';

    notifyText_nodejsNotUtd = 'Update available for Node.js 😎';
    notifyText_hbNotRunning_backNormal = 'Your Homebridge instance is back online 😁';
    notifyText_hbNotUtd_backNormal = 'Homebridge is now up to date ✌️';
    notifyText_pluginsNotUtd_backNormal = 'Plugins are now up to date ✌️';
    notifyText_nodejsNotUtd_backNormal = 'Node.js is now up to date ✌️';

    siriGui_title_update_available = 'Available Updates:';
    siriGui_title_all_UTD = 'Everything is up to date!';
    siriGui_icon_version = 'arrow.right.square.fill'; // can be any SFSymbol
    siriGui_icon_version_color = '#' + Color.blue().hex; // must have form like '#FFFFFF'
    siri_spokenAnswer_update_available = 'At least one update is available';
    siri_spokenAnswer_all_UTD = 'Everything is up to date';

    error_noConnectionText = '   ' + this.failIcon + ' UI-Service not reachable!\n          ' + this.bulletPointIcon + ' Server started?\n          ' + this.bulletPointIcon + ' UI-Service process started?\n          ' + this.bulletPointIcon + ' Server-URL ' + this.hbServiceMachineBaseUrl + ' correct?\n          ' + this.bulletPointIcon + ' Are you in the same network?';
}

// CONFIGURATION END //////////////////////

// POTENTIAL CANDIDATES FOR BEING IN THE CONFIGURATION /////
const dateFormat = 'dd.MM.yyyy HH:mm:ss'; // for US use 'MM/dd/yyyy HH:mm:ss';
const HB_LOGO_FILE_NAME = Device.model() + 'hbLogo.png';
const headerFontSize = 12;
const informationFontSize = 10;
const chartAxisFontSize = 7;
const dateFontSize = 7;
// POTENTIAL CANDIDATES FOR BEING IN THE CONFIGURATION END //


let CONFIGURATION = new Configuration();
const noAuthUrl = () => CONFIGURATION.hbServiceMachineBaseUrl + '/api/auth/noauth';
const authUrl = () => CONFIGURATION.hbServiceMachineBaseUrl + '/api/auth/login';
const cpuUrl = () => CONFIGURATION.hbServiceMachineBaseUrl + '/api/status/cpu';
const hbStatusUrl = () => CONFIGURATION.hbServiceMachineBaseUrl + '/api/status/homebridge';
const ramUrl = () => CONFIGURATION.hbServiceMachineBaseUrl + '/api/status/ram';
const uptimeUrl = () => CONFIGURATION.hbServiceMachineBaseUrl + '/api/status/uptime';
const pluginsUrl = () => CONFIGURATION.hbServiceMachineBaseUrl + '/api/plugins';
const hbVersionUrl = () => CONFIGURATION.hbServiceMachineBaseUrl + '/api/status/homebridge-version';
const nodeJsUrl = () => CONFIGURATION.hbServiceMachineBaseUrl + '/api/status/nodejs';


const timeFormatter = new DateFormatter();
timeFormatter.dateFormat = dateFormat;
const maxLineWidth = 300; // if layout doesn't look good for you,
const normalLineHeight = 35; // try to tweak the (font-)sizes & remove/add spaces below
const headerFont = Font.boldMonospacedSystemFont(headerFontSize);
const infoFont = Font.systemFont(informationFontSize);
const chartAxisFont = Font.systemFont(chartAxisFontSize);
const updatedAtFont = Font.systemFont(dateFontSize);

const purpleBgGradient_light = createLinearGradient('#421367', '#481367');
const purpleBgGradient_dark = createLinearGradient('#250b3b', '#320d47');
const blackBgGradient_light = createLinearGradient('#707070', '#3d3d3d');
const blackBgGradient_dark = createLinearGradient('#111111', '#222222');

const UNAVAILABLE = 'UNAVAILABLE';

const NOTIFICATION_JSON_VERSION = 1; // never change this!
const NOTIFICATION_JSON_FILE_NAME = 'notificationState.json'; // never change this!

const INITIAL_NOTIFICATION_STATE = {
    'jsonVersion': NOTIFICATION_JSON_VERSION,
    'hbRunning': {'status': true},
    'hbUtd': {'status': true},
    'pluginsUtd': {'status': true},
    'nodeUtd': {'status': true}
};

class LineChart {
    // LineChart by https://kevinkub.de/
    // taken from https://gist.github.com/kevinkub/b74f9c16f050576ae760a7730c19b8e2
    constructor(width, height, values) {
        this.ctx = new DrawContext();
        this.ctx.size = new Size(width, height);
        this.values = values;
    }

    _calculatePath() {
        let maxValue = Math.max(...this.values);
        let minValue = Math.min(...this.values);
        let difference = maxValue - minValue;
        let count = this.values.length;
        let step = this.ctx.size.width / (count - 1);
        let points = this.values.map((current, index, all) => {
            let x = step * index;
            let y = this.ctx.size.height - (current - minValue) / difference * this.ctx.size.height;
            return new Point(x, y);
        });
        return this._getSmoothPath(points);
    }

    _getSmoothPath(points) {
        let path = new Path();
        path.move(new Point(0, this.ctx.size.height));
        path.addLine(points[0]);
        for (let i = 0; i < points.length - 1; i++) {
            let xAvg = (points[i].x + points[i + 1].x) / 2;
            let yAvg = (points[i].y + points[i + 1].y) / 2;
            let avg = new Point(xAvg, yAvg);
            let cp1 = new Point((xAvg + points[i].x) / 2, points[i].y);
            let next = new Point(points[i + 1].x, points[i + 1].y);
            let cp2 = new Point((xAvg + points[i + 1].x) / 2, points[i + 1].y);
            path.addQuadCurve(avg, cp1);
            path.addQuadCurve(next, cp2);
        }
        path.addLine(new Point(this.ctx.size.width, this.ctx.size.height));
        path.closeSubpath();
        return path;
    }

    configure(fn) {
        let path = this._calculatePath();
        if (fn) {
            fn(this.ctx, path);
        } else {
            this.ctx.addPath(path);
            this.ctx.fillPath(path);
        }
        return this.ctx;
    }
}

// WIDGET INIT //////////////////////
let widget = await createWidget();
if (!config.runsInWidget) {
    await widget.presentMedium();
}

Script.setWidget(widget);
Script.complete();

// WIDGET INIT END //////////////////


async function createWidget() {
    // fileManagerMode must be LOCAL if you do not use iCloud drive
    let fm = CONFIGURATION.fileManagerMode === 'LOCAL' ? FileManager.local() : FileManager.iCloud();

    if (args.widgetParameter) {
// you can either provide as parameter:
//  - the config.json file name you want to load the credentials from (must be created before it can be used but highly recommended)
//      valid example: 'USE_CONFIG:yourfilename.json' (the 'yourfilename' part can be changed by you)
//      this single parameter must start with USE_CONFIG: and end with .json
// - credentials + URL directly (all other changes to the script are lost when you update it e.g. via https://scriptdu.de )
//      credentials must be separated by two commas like <username>,,<password>,,<hbServiceMachineBaseUrl>
//      a valid real example: admin,,mypassword123,,http://192.168.178.33:8581
//      If no password is needed for you to login just enter anything: xyz,,xyz,,http://192.168.178.33:8581
        if (args.widgetParameter.length > 0) {
            let foundCredentialsInParameter = useCredentialsFromWidgetParameter(args.widgetParameter);
            let fileNameSuccessfullySet = false;
            if (!foundCredentialsInParameter) {
                fileNameSuccessfullySet = checkIfConfigFileParameterIsProvided(fm, args.widgetParameter);
            }
            if (!foundCredentialsInParameter && !fileNameSuccessfullySet) {
                throw('Format of provided parameter not valid\n2 Valid examples: 1. USE_CONFIG:yourfilename.json\n2. admin,,mypassword123,,http://192.168.178.33:8581');
            }
        }
    }
    let pathToConfig = getFilePath(configurationFileName, fm);
    if (usePersistedConfiguration && !overwritePersistedConfig) {
        CONFIGURATION = getPersistedObject(fm, pathToConfig, CONFIGURATION_JSON_VERSION, CONFIGURATION, false);
        log('Configuration ' + configurationFileName + ' has been loaded and is used!')
    }

    // authenticate against the hb-service
    let token = await getAuthToken();
    if (token === undefined) {
        throw('Credentials not valid');
    }
    let widget = new ListWidget();

    handleSettingOfBackgroundColor(widget);

    if (token !== UNAVAILABLE) {
        widget.addSpacer(10);
    }

    // LOGO AND HEADER //////////////////////
    let titleStack = widget.addStack();
    titleStack.size = new Size(maxLineWidth, normalLineHeight);
    const logo = await getHbLogo(fm);
    const imgWidget = titleStack.addImage(logo);
    imgWidget.imageSize = new Size(40, 30);

    let headerText = addStyledText(titleStack, ' ' + CONFIGURATION.homebridgeTitle + ' ', headerFont);
    headerText.size = new Size(60, normalLineHeight);
    // LOGO AND HEADER END //////////////////////


    if (token === UNAVAILABLE) {
        // script ends after the next line
        return addNotAvailableInfos(widget, titleStack);
    }

    // fetch all the data necessary
    let hbStatus = await getHomebridgeStatus(token);
    let hbVersionInfos = await getHomebridgeVersionInfos(token);
    let hbUpToDate = hbVersionInfos === undefined ? undefined : !hbVersionInfos.updateAvailable;
    let pluginVersionInfos = await getPluginVersionInfos(token);
    let pluginsUpToDate = pluginVersionInfos === undefined ? undefined : !pluginVersionInfos.updateAvailable;
    let nodeJsVersionInfos = await getNodeJsVersionInfos(token);
    let nodeJsUpToDate = nodeJsVersionInfos === undefined ? undefined : !nodeJsVersionInfos.updateAvailable;

    if (usePersistedConfiguration || overwritePersistedConfig) {
        // if here, the configuration seems valid -> save it for next time
        log('The valid configuration ' + configurationFileName + ' has been saved. Changes can only be applied if overwritePersistedConfig is set to true. Should be set to false after applying changes again!')
        persistObject(fm, CONFIGURATION, pathToConfig);
    }

    // STATUS PANEL IN THE HEADER ///////////////////
    titleStack.addSpacer(CONFIGURATION.spacer_beforeFirstStatusColumn);
    let statusInfo = titleStack.addStack();
    let firstColumn = statusInfo.addStack();
    firstColumn.layoutVertically();
    addStatusInfo(firstColumn, hbStatus, CONFIGURATION.status_hbRunning);
    firstColumn.addSpacer(5);
    addStatusInfo(firstColumn, pluginsUpToDate, CONFIGURATION.status_pluginsUtd);

    statusInfo.addSpacer(CONFIGURATION.spacer_betweenStatusColumns);

    let secondColumn = statusInfo.addStack();
    secondColumn.layoutVertically();
    addStatusInfo(secondColumn, hbUpToDate, CONFIGURATION.status_hbUtd);
    secondColumn.addSpacer(5);
    addStatusInfo(secondColumn, nodeJsUpToDate, CONFIGURATION.status_nodejsUtd);

    titleStack.addSpacer(CONFIGURATION.spacer_afterSecondColumn);
    // STATUS PANEL IN THE HEADER END ////////////////

    widget.addSpacer(10);
    if (!config.runsWithSiri) {
        await buildUsualGui(widget, token);
    } else if (config.runsWithSiri) {
        buildSiriGui(widget, hbVersionInfos, pluginVersionInfos, nodeJsVersionInfos);
    }

    if (CONFIGURATION.notificationEnabled) {
        handleNotifications(fm, hbStatus, hbUpToDate, pluginsUpToDate, nodeJsUpToDate);
    }
    return widget;
}

function buildSiriGui(widget, hbVersionInfos, pluginVersionInfos, nodeJsVersionInfos) {
    let mainColumns = widget.addStack();
    mainColumns.size = new Size(maxLineWidth, 100);

    let verticalStack = mainColumns.addStack();
    verticalStack.layoutVertically();
    if (hbVersionInfos.updateAvailable || pluginVersionInfos.updateAvailable || nodeJsVersionInfos.updateAvailable) {
        speakUpdateStatus(true);
        addStyledText(verticalStack, CONFIGURATION.siriGui_title_update_available, infoFont);
        if (hbVersionInfos.updateAvailable) {
            verticalStack.addSpacer(5);
            addUpdatableElement(verticalStack, CONFIGURATION.bulletPointIcon + hbVersionInfos.name + ': ', hbVersionInfos.installedVersion, hbVersionInfos.latestVersion);
        }
        if (pluginVersionInfos.updateAvailable) {
            for (plugin of pluginVersionInfos.plugins) {
                if (CONFIGURATION.pluginsOrSwUpdatesToIgnore.includes(plugin.name)) {
                    continue;
                }
                if (plugin.updateAvailable) {
                    verticalStack.addSpacer(5);
                    addUpdatableElement(verticalStack, CONFIGURATION.bulletPointIcon + plugin.name + ': ', plugin.installedVersion, plugin.latestVersion);
                }
            }
        }
        if (nodeJsVersionInfos.updateAvailable) {
            verticalStack.addSpacer(5);
            addUpdatableElement(verticalStack, CONFIGURATION.bulletPointIcon + nodeJsVersionInfos.name + ': ', nodeJsVersionInfos.currentVersion, nodeJsVersionInfos.latestVersion);
        }
    } else {
        speakUpdateStatus(false);
        verticalStack.addSpacer(30);
        addStyledText(verticalStack, CONFIGURATION.siriGui_title_all_UTD, infoFont);
    }
}

function speakUpdateStatus(updateAvailable) {
    if (CONFIGURATION.enableSiriFeedback) {
        if (updateAvailable) {
            Speech.speak(CONFIGURATION.siri_spokenAnswer_update_available);
        } else {
            Speech.speak(CONFIGURATION.siri_spokenAnswer_all_UTD);
        }
    }
}

async function buildUsualGui(widget, token) {
    let cpuData = await fetchData(token, cpuUrl());
    let ramData = await fetchData(token, ramUrl());
    let usedRamText = await getUsedRamString(ramData);
    let uptimesArray = await getUptimesArray(token);
    if (cpuData && ramData) {
        let mainColumns = widget.addStack();
        mainColumns.size = new Size(maxLineWidth, 77);
        mainColumns.addSpacer(4)

        // FIRST COLUMN //////////////////////
        let firstColumn = mainColumns.addStack();
        firstColumn.layoutVertically();
        addTitleAboveChartToWidget(firstColumn, CONFIGURATION.title_cpuLoad + getAsRoundedString(cpuData.currentLoad, 1) + '%');
        addChartToWidget(firstColumn, cpuData.cpuLoadHistory);

        let temperatureString = getTemperatureString(cpuData?.cpuTemperature.main);
        if (temperatureString !== 'unknown') {
            let cpuTempText = addStyledText(firstColumn, CONFIGURATION.title_cpuTemp + temperatureString, infoFont);
            cpuTempText.size = new Size(150, 30);
            setTextColor(cpuTempText);
        }
        // FIRST COLUMN END //////////////////////

        mainColumns.addSpacer(11);

        // SECOND COLUMN //////////////////////
        let secondColumn = mainColumns.addStack();
        secondColumn.layoutVertically();
        addTitleAboveChartToWidget(secondColumn, CONFIGURATION.title_ramUsage + usedRamText + '%');
        addChartToWidget(secondColumn, ramData.memoryUsageHistory);

        if (uptimesArray) {
            let uptimesStack = secondColumn.addStack();

            let upStack = uptimesStack.addStack();
            addStyledText(upStack, CONFIGURATION.title_uptimes, infoFont);

            let vertPointsStack = upStack.addStack();
            vertPointsStack.layoutVertically();

            addStyledText(vertPointsStack, CONFIGURATION.bulletPointIcon + CONFIGURATION.title_systemGuiName + uptimesArray[0], infoFont);
            addStyledText(vertPointsStack, CONFIGURATION.bulletPointIcon + CONFIGURATION.title_uiService + uptimesArray[1], infoFont);
        }
        // SECOND COLUMN END//////////////////////

        widget.addSpacer(10);

        // BOTTOM UPDATED TEXT //////////////////////
        let updatedAt = addStyledText(widget, 't: ' + timeFormatter.string(new Date()), updatedAtFont);
        updatedAt.centerAlignText();
    }
}

function addUpdatableElement(stackToAdd, elementTitle, versionCurrent, versionLatest) {
    let itemStack = stackToAdd.addStack();
    itemStack.addSpacer(17);
    addStyledText(itemStack, elementTitle, infoFont);

    let vertPointsStack = itemStack.addStack();
    vertPointsStack.layoutVertically();

    let versionStack = vertPointsStack.addStack();
    addStyledText(versionStack, versionCurrent, infoFont);
    versionStack.addSpacer(3);
    addIcon(versionStack, CONFIGURATION.siriGui_icon_version, new Color(CONFIGURATION.siriGui_icon_version_color));
    versionStack.addSpacer(3);
    addStyledText(versionStack, versionLatest, infoFont);
}

function handleSettingOfBackgroundColor(widget) {
    if (!CONFIGURATION.adaptToLightOrDarkMode) {
        switch (CONFIGURATION.bgColorMode) {
            case "CUSTOM":
                widget.backgroundGradient = createLinearGradient(CONFIGURATION.customBackgroundColor1_light, CONFIGURATION.customBackgroundColor2_light);
                break;
            case "BLACK_LIGHT":
                widget.backgroundGradient = blackBgGradient_light;
                break;
            case "BLACK_DARK":
                widget.backgroundGradient = blackBgGradient_dark;
                break;
            case "PURPLE_DARK":
                widget.backgroundGradient = purpleBgGradient_dark;
                break;
            case "PURPLE_LIGHT":
            default:
                widget.backgroundGradient = purpleBgGradient_light;
        }
    } else {
        switch (CONFIGURATION.bgColorMode) {
            case "CUSTOM":
                setGradient(widget,
                    createLinearGradient(CONFIGURATION.customBackgroundColor1_light, CONFIGURATION.customBackgroundColor2_light),
                    createLinearGradient(CONFIGURATION.customBackgroundColor1_dark, CONFIGURATION.customBackgroundColor2_dark));
                break;
            case "BLACK_LIGHT":
            case "BLACK_DARK":
                setGradient(widget, blackBgGradient_light, blackBgGradient_dark);
                break;
            case "PURPLE_DARK":
            case "PURPLE_LIGHT":
            default:
                setGradient(widget, purpleBgGradient_light, purpleBgGradient_dark);
        }
    }
}

function setGradient(widget, lightOption, darkOption) {
    if (Device.isUsingDarkAppearance()) {
        widget.backgroundGradient = darkOption;
    } else {
        widget.backgroundGradient = lightOption;
    }
}

function getChartColorToUse() {
    if (CONFIGURATION.adaptToLightOrDarkMode && Device.isUsingDarkAppearance()) {
        return new Color(CONFIGURATION.chartColor_dark);
    } else {
        return new Color(CONFIGURATION.chartColor_light);
    }
}

function setTextColor(textWidget) {
    if (CONFIGURATION.adaptToLightOrDarkMode && Device.isUsingDarkAppearance()) {
        textWidget.textColor = new Color(CONFIGURATION.fontColor_dark);
    } else {
        textWidget.textColor = new Color(CONFIGURATION.fontColor_light);
    }
}

function createLinearGradient(color1, color2) {
    const gradient = new LinearGradient();
    gradient.locations = [0, 1];
    gradient.colors = [new Color(color1), new Color(color2)];
    return gradient;
}

function addStyledText(stackToAddTo, text, font) {
    let textHandle = stackToAddTo.addText(text);
    textHandle.font = font;
    setTextColor(textHandle);
    return textHandle;
}

function addTitleAboveChartToWidget(column, titleText) {
    let cpuLoadTitle = column.addText(titleText);
    cpuLoadTitle.font = infoFont;
    setTextColor(cpuLoadTitle);
}

function addChartToWidget(column, chartData) {
    let horizontalStack = column.addStack();
    horizontalStack.addSpacer(5);
    let yAxisLabelsStack = horizontalStack.addStack();
    yAxisLabelsStack.layoutVertically();

    addStyledText(yAxisLabelsStack, getMaxString(chartData, 2) + '%', chartAxisFont);
    yAxisLabelsStack.addSpacer(6);
    addStyledText(yAxisLabelsStack, getMinString(chartData, 2) + '%', chartAxisFont);
    yAxisLabelsStack.addSpacer(6);

    horizontalStack.addSpacer(2);

    let chartImage = new LineChart(500, 100, chartData).configure((ctx, path) => {
        ctx.opaque = false;
        ctx.setFillColor(getChartColorToUse());
        ctx.addPath(path);
        ctx.fillPath(path);
    }).getImage();

    let vertChartImageStack = horizontalStack.addStack();
    vertChartImageStack.layoutVertically();

    let chartImageHandle = vertChartImageStack.addImage(chartImage);
    chartImageHandle.imageSize = new Size(100, 25);

    let xAxisStack = vertChartImageStack.addStack();
    xAxisStack.size = new Size(100, 10);

    addStyledText(xAxisStack, 't-10m', chartAxisFont);
    xAxisStack.addSpacer(75);
    addStyledText(xAxisStack, 't', chartAxisFont);

    column.addSpacer(7);
}

function checkIfConfigFileParameterIsProvided(fm, givenParameter) {
    if (givenParameter.trim().startsWith('USE_CONFIG:') && givenParameter.trim().endsWith('.json')) {
        configurationFileName = givenParameter.trim().split('USE_CONFIG:')[1];
        if (!fm.fileExists(getFilePath(configurationFileName, fm))) {
            throw('Config file with provided name ' + configurationFileName + ' does not exist!\nCreate it first by running the script once providing the name in variable configurationFileName and maybe with variable overwritePersistedConfig set to true');
        }
        return true;
    }
    return false;
}

function useCredentialsFromWidgetParameter(givenParameter) {
    if (givenParameter.includes(',,')) {
        let credentials = givenParameter.split(',,');
        if (credentials.length === 3 && credentials[0].length > 0 && credentials[1].length > 0 &&
            credentials[2].length > 0 && credentials[2].startsWith('http')) {
            CONFIGURATION.userName = credentials[0].trim();
            CONFIGURATION.password = credentials[1].trim();
            CONFIGURATION.hbServiceMachineBaseUrl = credentials[2].trim();
            return true;
        }
    }
    return false;
}

async function getAuthToken() {
    if (CONFIGURATION.hbServiceMachineBaseUrl === '>enter the ip with the port here<') {
        throw('Base URL to machine not entered! Edit variable called hbServiceMachineBaseUrl')
    }
    let req = new Request(noAuthUrl());
    req.timeoutInterval = CONFIGURATION.requestTimeoutInterval;
    const headers = {
        'accept': '*\/*', 'Content-Type': 'application/json'
    };
    req.method = 'POST';
    req.headers = headers;
    req.body = JSON.stringify({});
    let authData;
    try {
        authData = await req.loadJSON();
    } catch (e) {
        return UNAVAILABLE;
    }
    if (authData.access_token) {
        // no credentials needed
        return authData.access_token;
    }

    req = new Request(authUrl());
    req.timeoutInterval = CONFIGURATION.requestTimeoutInterval;
    let body = {
        'username': CONFIGURATION.userName,
        'password': CONFIGURATION.password,
        'otp': 'string'
    };
    req.body = JSON.stringify(body);
    req.method = 'POST';
    req.headers = headers;
    try {
        authData = await req.loadJSON();
    } catch (e) {
        return UNAVAILABLE;
    }
    return authData.access_token;
}

async function fetchData(token, url) {
    let req = new Request(url);
    req.timeoutInterval = CONFIGURATION.requestTimeoutInterval;
    let headers = {
        'accept': '*\/*', 'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
    };
    req.headers = headers;
    let result;
    try {
        result = req.loadJSON();
    } catch (e) {
        return undefined;
    }
    return result;
}

async function getHomebridgeStatus(token) {
    const statusData = await fetchData(token, hbStatusUrl());
    if (statusData === undefined) {
        return undefined;
    }
    return statusData.status === 'up';
}

async function getHomebridgeVersionInfos(token) {
    if (CONFIGURATION.pluginsOrSwUpdatesToIgnore.includes('HOMEBRIDGE_UTD')) {
        log('You configured Homebridge to not be checked for updates. Widget will show that it\'s UTD!');
        return {updateAvailable: false};
    }
    const hbVersionData = await fetchData(token, hbVersionUrl());
    if (hbVersionData === undefined) {
        return undefined;
    }
    return hbVersionData;
}

async function getNodeJsVersionInfos(token) {
    if (CONFIGURATION.pluginsOrSwUpdatesToIgnore.includes('NODEJS_UTD')) {
        log('You configured Node.js to not be checked for updates. Widget will show that it\'s UTD!');
        return {updateAvailable: false};
    }
    const nodeJsData = await fetchData(token, nodeJsUrl());
    if (nodeJsData === undefined) {
        return undefined;
    }
    nodeJsData.name = 'node.js';
    return nodeJsData;
}

async function getPluginVersionInfos(token) {
    const pluginsData = await fetchData(token, pluginsUrl());
    if (pluginsData === undefined) {
        return undefined;
    }
    for (plugin of pluginsData) {
        if (CONFIGURATION.pluginsOrSwUpdatesToIgnore.includes(plugin.name)) {
            log('You configured ' + plugin.name + ' to not be checked for updates. Widget will show that it\'s UTD!');
            continue;
        }
        if (plugin.updateAvailable) {
            return {plugins: pluginsData, updateAvailable: true};
        }
    }
    return {plugins: pluginsData, updateAvailable: false};
}

async function getUsedRamString(ramData) {
    if (ramData === undefined) return 'unknown';
    return getAsRoundedString(100 - 100 * ramData.mem.available / ramData.mem.total, 2);
}

async function getUptimesArray(token) {
    const uptimeData = await fetchData(token, uptimeUrl());
    if (uptimeData === undefined) return undefined;

    return [formatSeconds(uptimeData.time.uptime), formatSeconds(uptimeData.processUptime)];
}

function formatSeconds(value) {
    if (value > 60 * 60 * 24 * 10) {
        return getAsRoundedString(value / 60 / 60 / 24, 0) + 'd'; // more than 10 days
    } else if (value > 60 * 60 * 24) {
        return getAsRoundedString(value / 60 / 60 / 24, 1) + 'd';
    } else if (value > 60 * 60) {
        return getAsRoundedString(value / 60 / 60, 1) + 'h';
    } else if (value > 60) {
        return getAsRoundedString(value / 60, 1) + 'm';
    } else {
        return getAsRoundedString(value, 1) + 's';
    }
}

async function loadImage(imgUrl) {
    let req = new Request(imgUrl);
    req.timeoutInterval = CONFIGURATION.requestTimeoutInterval;
    let image = await req.loadImage();
    return image;
}

async function getHbLogo(fm) {
    let path = getFilePath(HB_LOGO_FILE_NAME, fm);
    if (fm.fileExists(path)) {
        const fileDownloaded = await fm.isFileDownloaded(path);
        if (!fileDownloaded) {
            await fm.downloadFileFromiCloud(path);
        }
        return fm.readImage(path);
    } else {
        // logo did not exist -> download it and save it for next time the widget runs
        const logo = await loadImage(CONFIGURATION.logoUrl);
        fm.writeImage(path, logo);
        return logo;
    }
}

function getFilePath(fileName, fm) {
    let dirPath = fm.joinPath(fm.documentsDirectory(), 'homebridgeStatus');
    if (!fm.fileExists(dirPath)) {
        fm.createDirectory(dirPath);
    }
    return fm.joinPath(dirPath, fileName);
}

function addNotAvailableInfos(widget, titleStack) {
    let statusInfo = titleStack.addText('                                                 ');
    setTextColor(statusInfo);
    statusInfo.size = new Size(150, normalLineHeight);
    let errorText = widget.addText(CONFIGURATION.error_noConnectionText);
    errorText.size = new Size(410, 130);
    errorText.font = infoFont;
    setTextColor(errorText);


    widget.addSpacer(15);
    let updatedAt = widget.addText('t: ' + timeFormatter.string(new Date()));
    updatedAt.font = updatedAtFont;
    setTextColor(updatedAt);
    updatedAt.centerAlignText();

    return widget;
}

function getAsRoundedString(value, decimals) {
    let factor = Math.pow(10, decimals);
    return (Math.round((value + Number.EPSILON) * factor) / factor).toString().replace('.', CONFIGURATION.decimalChar);
}

function getMaxString(arrayOfNumbers, decimals) {
    let factor = Math.pow(10, decimals);
    return (Math.round((Math.max(...arrayOfNumbers) + Number.EPSILON) * factor) / factor).toString().replace('.', CONFIGURATION.decimalChar);
}

function getMinString(arrayOfNumbers, decimals) {
    let factor = Math.pow(10, decimals);
    return (Math.round((Math.min(...arrayOfNumbers) + Number.EPSILON) * factor) / factor).toString().replace('.', CONFIGURATION.decimalChar);
}

function getTemperatureString(temperatureInCelsius) {
    if (temperatureInCelsius === undefined || temperatureInCelsius < 0) return 'unknown';

    if (CONFIGURATION.temperatureUnitConfig === 'FAHRENHEIT') {
        return getAsRoundedString(convertToFahrenheit(temperatureInCelsius), 1) + '°F';
    } else {
        return getAsRoundedString(temperatureInCelsius, 1) + '°C';
    }
}

function convertToFahrenheit(temperatureInCelsius) {
    return temperatureInCelsius * 9 / 5 + 32;
}

function addStatusIcon(widget, statusBool) {
    let name = '';
    let color;
    if (statusBool === undefined) {
        name = CONFIGURATION.icon_statusUnknown;
        color = new Color(CONFIGURATION.icon_colorUnknown);
    } else if (statusBool) {
        name = CONFIGURATION.icon_statusGood;
        color = new Color(CONFIGURATION.icon_colorGood);
    } else {
        name = CONFIGURATION.icon_statusBad;
        color = new Color(CONFIGURATION.icon_colorBad);
    }
    addIcon(widget, name, color);
}

function addStatusInfo(lineWidget, statusBool, shownText) {
    let itemStack = lineWidget.addStack();
    addStatusIcon(itemStack, statusBool);
    itemStack.addSpacer(2);
    let text = itemStack.addText(shownText);
    text.font = Font.semiboldMonospacedSystemFont(10);
    setTextColor(text);
}

function handleNotifications(fm, hbRunning, hbUtd, pluginsUtd, nodeUtd) {
    let path = getFilePath(NOTIFICATION_JSON_FILE_NAME, fm);
    let state = getPersistedObject(fm, path, NOTIFICATION_JSON_VERSION, INITIAL_NOTIFICATION_STATE, true);
    let now = new Date();
    let shouldUpdateState = false;
    if (shouldNotify(hbRunning, state.hbRunning.status, state.hbRunning.lastNotified)) {
        state.hbRunning.status = hbRunning;
        state.hbRunning.lastNotified = now;
        shouldUpdateState = true;
        scheduleNotification(CONFIGURATION.notifyText_hbNotRunning);
    } else if (hbRunning && !state.hbRunning.status) {
        state.hbRunning.status = hbRunning;
        state.hbRunning.lastNotified = undefined;
        shouldUpdateState = true;
        if (!CONFIGURATION.disableStateBackToNormalNotifications) {
            scheduleNotification(CONFIGURATION.notifyText_hbNotRunning_backNormal);
        }
    }

    if (shouldNotify(hbUtd, state.hbUtd.status, state.hbUtd.lastNotified)) {
        state.hbUtd.status = hbUtd;
        state.hbUtd.lastNotified = now;
        shouldUpdateState = true;
        scheduleNotification(CONFIGURATION.notifyText_hbNotUtd);
    } else if (hbUtd && !state.hbUtd.status) {
        state.hbUtd.status = hbUtd;
        state.hbUtd.lastNotified = undefined;
        shouldUpdateState = true;
        if (!CONFIGURATION.disableStateBackToNormalNotifications) {
            scheduleNotification(CONFIGURATION.notifyText_hbNotUtd_backNormal);
        }
    }

    if (shouldNotify(pluginsUtd, state.pluginsUtd.status, state.pluginsUtd.lastNotified)) {
        state.pluginsUtd.status = pluginsUtd;
        state.pluginsUtd.lastNotified = now;
        shouldUpdateState = true;
        scheduleNotification(CONFIGURATION.notifyText_pluginsNotUtd);
    } else if (pluginsUtd && !state.pluginsUtd.status) {
        state.pluginsUtd.status = pluginsUtd;
        state.pluginsUtd.lastNotified = undefined;
        shouldUpdateState = true;
        if (!CONFIGURATION.disableStateBackToNormalNotifications) {
            scheduleNotification(CONFIGURATION.notifyText_pluginsNotUtd_backNormal);
        }
    }

    if (shouldNotify(nodeUtd, state.nodeUtd.status, state.nodeUtd.lastNotified)) {
        state.nodeUtd.status = nodeUtd;
        state.nodeUtd.lastNotified = now;
        shouldUpdateState = true;
        scheduleNotification(CONFIGURATION.notifyText_nodejsNotUtd);
    } else if (nodeUtd && !state.nodeUtd.status) {
        state.nodeUtd.status = nodeUtd;
        state.nodeUtd.lastNotified = undefined;
        shouldUpdateState = true;
        if (!CONFIGURATION.disableStateBackToNormalNotifications) {
            scheduleNotification(CONFIGURATION.notifyText_nodejsNotUtd_backNormal);
        }
    }

    if (shouldUpdateState) {
        persistObject(fm, state, path);
    }
}

function shouldNotify(currentBool, boolFromLastTime, lastNotifiedDate) {
    return (!currentBool && (boolFromLastTime || isTimeToNotifyAgain(lastNotifiedDate)));
}

function isTimeToNotifyAgain(dateToCheck) {
    if (dateToCheck === undefined) return true;

    let dateInThePast = new Date(dateToCheck);
    let now = new Date();
    let timeBetweenDates = parseInt((now.getTime() - dateInThePast.getTime()) / 1000); // seconds
    return timeBetweenDates > CONFIGURATION.notificationIntervalInDays * 24 * 60 * 60;
}

function scheduleNotification(text) {
    let not = new Notification();
    not.title = CONFIGURATION.notification_title;
    not.body = text;
    not.addAction(CONFIGURATION.notification_expandedButtonText, CONFIGURATION.hbServiceMachineBaseUrl, false);
    not.sound = CONFIGURATION.notification_ringTone;
    not.schedule();
}

function getPersistedObject(fm, path, versionToCheckAgainst, initialObjectToPersist, createIfNotExisting) {
    if (fm.fileExists(path)) {
        let raw, persistedObject;
        try {
            raw = fm.readString(path);
            persistedObject = JSON.parse(raw);
        } catch (e) {
            // file corrupted -> remove it
            fm.remove(path);
        }

        if (persistedObject && (persistedObject.jsonVersion === undefined || persistedObject.jsonVersion < versionToCheckAgainst)) {
            // the version of the json file is outdated -> remove it and recreate it
            log('Unfortunately, the configuration structure changed and your old config is not compatible anymore. It is now removed and a new one is created with the initial configuration. ')
            fm.remove(path);
        } else {
            return persistedObject;
        }
    }
    if (createIfNotExisting) {
        // create a new state json
        persistObject(fm, initialObjectToPersist, path);
    }
    return initialObjectToPersist;
}

function persistObject(fm, object, path) {
    let raw = JSON.stringify(object);
    fm.writeString(path, raw);
}

function addIcon(widget, name, color) {
    let sf = SFSymbol.named(name);
    sf.applyFont(Font.heavySystemFont(50));
    let iconImage = sf.image;
    let imageWidget = widget.addImage(iconImage);
    imageWidget.resizable = true;
    imageWidget.imageSize = new Size(13, 13);
    imageWidget.tintColor = color;
}