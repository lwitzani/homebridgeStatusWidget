// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: blue; icon-glyph: magic;
// Check the readme at https://github.com/lwitzani/homebridgeStatusWidget for setup instructions, troubleshoots and also for updates of course!
// Code Version: 16.11.2022
// *********
// For power users:
// I added a configuration mechanism so you don't need to reconfigure it every time you update the script!
// Please check the readme for instructions on how to use the persist mechanism for the configuration
let configurationFileName = 'purple.json' // change this to an own name e.g. 'configBlack.json' . This name can then be given as a widget parameter in the form 'USE_CONFIG:yourfilename.json' so you don't loose your preferred configuration across script updates (but you will loose it if i have to change the configuration format)
const usePersistedConfiguration = true; // false would mean to use the visible configuration below; true means the state saved in iCloud (or locally) will be used
const overwritePersistedConfig = false; // if you like your configuration, run the script ONCE with this param to true, then it is saved and can be used via 'USE_CONFIG:yourfilename.json' in widget params
// *********

const CONFIGURATION_JSON_VERSION = 3; // never change this! If i need to change the structure of configuration class, i will increase this counter. Your created config files sadly won't be compatible afterwards.
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
    requestTimeoutInterval = 3; // in seconds; If requests take longer, the script is stopped. Increase it if it doesn't work or you
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

    // logo is downloaded only the first time! It is saved in iCloud and then loaded from there everytime afterwards
    logoUrl = 'https://raw.githubusercontent.com/homebridge/branding/latest/logos/homebridge-silhouette-round-white.png';

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
    error_noConnectionLockScreenText = '  ' + this.failIcon + ' UI-Service not reachable!\n    ' + this.bulletPointIcon + ' Server started?\n    ' + this.bulletPointIcon + ' UI-Service process started?\n    ' + this.bulletPointIcon + ' ' + this.hbServiceMachineBaseUrl + ' correct?\n    ' + this.bulletPointIcon + ' Are you in the same network?';

    widgetTitle = ' Homebridge ';
    dateFormat = 'dd.MM.yyyy HH:mm:ss'; // for US use 'MM/dd/yyyy HH:mm:ss';
    hbLogoFileName = Device.model() + 'hbLogo.png';
    headerFontSize = 12;
    informationFontSize = 10;
    chartAxisFontSize = 7;
    dateFontSize = 7;
    notificationJsonFileName = 'notificationState.json'; // multiple scripts for different homebridge instances should point to a different notificationJsonFileName
}

// CONFIGURATION END //////////////////////

let CONFIGURATION = new Configuration();
const noAuthUrl = () => CONFIGURATION.hbServiceMachineBaseUrl + '/api/auth/noauth';
const authUrl = () => CONFIGURATION.hbServiceMachineBaseUrl + '/api/auth/login';
const cpuUrl = () => CONFIGURATION.hbServiceMachineBaseUrl + '/api/status/cpu';
const overallStatusUrl = () => CONFIGURATION.hbServiceMachineBaseUrl + '/api/status/homebridge';
const ramUrl = () => CONFIGURATION.hbServiceMachineBaseUrl + '/api/status/ram';
const uptimeUrl = () => CONFIGURATION.hbServiceMachineBaseUrl + '/api/status/uptime';
const pluginsUrl = () => CONFIGURATION.hbServiceMachineBaseUrl + '/api/plugins';
const hbVersionUrl = () => CONFIGURATION.hbServiceMachineBaseUrl + '/api/status/homebridge-version';
const nodeJsUrl = () => CONFIGURATION.hbServiceMachineBaseUrl + '/api/status/nodejs';


const timeFormatter = new DateFormatter();
const maxLineWidth = 300; // if layout doesn't look good for you,
const normalLineHeight = 35; // try to tweak the (font-)sizes & remove/add spaces below
let headerFont, infoFont, chartAxisFont, updatedAtFont, token, fileManager;

let infoPanelFont = Font.semiboldMonospacedSystemFont(10);
let iconSize = 13;
let verticalSpacerInfoPanel = 5;

const purpleBgGradient_light = createLinearGradient('#421367', '#481367');
const purpleBgGradient_dark = createLinearGradient('#250b3b', '#320d47');
const blackBgGradient_light = createLinearGradient('#707070', '#3d3d3d');
const blackBgGradient_dark = createLinearGradient('#111111', '#222222');

const UNAVAILABLE = 'UNAVAILABLE';

const NOTIFICATION_JSON_VERSION = 1; // never change this!

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

class HomeBridgeStatus {
    overallStatus;
    hbVersionInfos;
    hbUpToDate;
    pluginVersionInfos;
    pluginsUpToDate;
    nodeJsVersionInfos;
    nodeJsUpToDate;

    constructor() {
    }

    async initialize() {
        this.overallStatus = await getOverallStatus();
        this.hbVersionInfos = await getHomebridgeVersionInfos();
        this.hbUpToDate = this.hbVersionInfos === undefined ? undefined : !this.hbVersionInfos.updateAvailable;
        this.pluginVersionInfos = await getPluginVersionInfos();
        this.pluginsUpToDate = this.pluginVersionInfos === undefined ? undefined : !this.pluginVersionInfos.updateAvailable;
        this.nodeJsVersionInfos = await getNodeJsVersionInfos();
        this.nodeJsUpToDate = this.nodeJsVersionInfos === undefined ? undefined : !this.nodeJsVersionInfos.updateAvailable;
        return this;
    }
}

// WIDGET INIT //////////////////////
await initializeFileManager_Configuration_TimeFormatter_Fonts_AndToken();
if (token === UNAVAILABLE) {
    await showNotAvailableWidget();
    // script ends after the next line
    return;
}
const homeBridgeStatus = await new HomeBridgeStatus().initialize();
await handleConfigPersisting();
await handleNotifications(homeBridgeStatus.overallStatus, homeBridgeStatus.hbUpToDate, homeBridgeStatus.pluginsUpToDate, homeBridgeStatus.nodeJsUpToDate);
await createAndShowWidget(homeBridgeStatus);
return;

// WIDGET INIT END //////////////////

async function initializeFileManager_Configuration_TimeFormatter_Fonts_AndToken() {
    // fileManagerMode must be LOCAL if you do not use iCloud drive
    fileManager = CONFIGURATION.fileManagerMode === 'LOCAL' ? FileManager.local() : FileManager.iCloud();

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
                fileNameSuccessfullySet = checkIfConfigFileParameterIsProvided(args.widgetParameter);
            }
            if (!foundCredentialsInParameter && !fileNameSuccessfullySet) {
                throw('Format of provided parameter not valid\n2 Valid examples: 1. USE_CONFIG:yourfilename.json\n2. admin,,mypassword123,,http://192.168.178.33:8581');
            }
        }
    }
    if (usePersistedConfiguration && !overwritePersistedConfig) {
        CONFIGURATION = await getPersistedObject(getFilePath(configurationFileName), CONFIGURATION_JSON_VERSION, CONFIGURATION, false);
        log('Configuration ' + configurationFileName + ' is used! Trying to authenticate...');
    }
    timeFormatter.dateFormat = CONFIGURATION.dateFormat;
    initializeFonts();
    await initializeToken();
}

async function createAndShowWidget(homeBridgeStatus) {
    if (config.runsInAccessoryWidget) {
        await createAndShowLockScreenWidget(homeBridgeStatus);
    } else {
        let widget = new ListWidget();
        handleSettingOfBackgroundColor(widget);
        if (!config.runsWithSiri) {
            await buildUsualGui(widget, homeBridgeStatus);
        } else if (config.runsWithSiri) {
            await buildSiriGui(widget, homeBridgeStatus);
        }
        finalizeAndShowWidget(widget);
    }
}

async function createAndShowLockScreenWidget(homeBridgeStatus) {
    let widget = new ListWidget();
    handleSettingOfBackgroundColor(widget);
    overwriteSizesForLockScreen();
    await buildLockScreenWidgetHeader(widget);
    await buildLockScreenWidgetBody(widget, homeBridgeStatus);
    await widget.presentSmall();
    Script.setWidget(widget);
    Script.complete();
}

async function handleConfigPersisting() {
    if (usePersistedConfiguration || overwritePersistedConfig) {
        // if here, the configuration seems valid -> save it for next time
        log('The valid configuration ' + configurationFileName + ' has been saved. Changes can only be applied if overwritePersistedConfig is set to true. Should be set to false after applying changes again!')
        persistObject(CONFIGURATION, getFilePath(configurationFileName));
    }
}

function buildStatusPanelInHeader(titleStack, homeBridgeStatus) {
    titleStack.addSpacer(CONFIGURATION.spacer_beforeFirstStatusColumn);
    let statusInfo = titleStack.addStack();
    let firstColumn = statusInfo.addStack();
    firstColumn.layoutVertically();
    addStatusInfo(firstColumn, homeBridgeStatus.overallStatus, CONFIGURATION.status_hbRunning);
    firstColumn.addSpacer(verticalSpacerInfoPanel);
    addStatusInfo(firstColumn, homeBridgeStatus.pluginsUpToDate, CONFIGURATION.status_pluginsUtd);

    statusInfo.addSpacer(CONFIGURATION.spacer_betweenStatusColumns);

    let secondColumn = statusInfo.addStack();
    secondColumn.layoutVertically();
    addStatusInfo(secondColumn, homeBridgeStatus.hbUpToDate, CONFIGURATION.status_hbUtd);
    secondColumn.addSpacer(verticalSpacerInfoPanel);
    addStatusInfo(secondColumn, homeBridgeStatus.nodeJsUpToDate, CONFIGURATION.status_nodejsUtd);

    titleStack.addSpacer(CONFIGURATION.spacer_afterSecondColumn);
}

async function showNotAvailableWidget() {
    if (!config.runsInAccessoryWidget) {
        let widget = new ListWidget();
        handleSettingOfBackgroundColor(widget);
        let mainStack = widget.addStack();
        await initializeLogoAndHeader(mainStack);
        addNotAvailableInfos(widget, mainStack);
        finalizeAndShowWidget(widget);
    } else {
        overwriteSizesForLockScreen();
        let widget = new ListWidget();
        handleSettingOfBackgroundColor(widget);
        await buildLockScreenWidgetHeader(widget);
        widget.addSpacer(2);
        addStyledText(widget, CONFIGURATION.error_noConnectionLockScreenText, updatedAtFont);
        await widget.presentSmall();
        Script.setWidget(widget);
        Script.complete();
    }
}

async function finalizeAndShowWidget(widget) {
    if (!config.runsInWidget) {
        await widget.presentMedium();
    }
    Script.setWidget(widget);
    Script.complete();
}

async function initializeToken() {
    // authenticate against the hb-service
    token = await getAuthToken();
    if (token === undefined) {
        throw('Credentials not valid');
    }
}

async function initializeLogoAndHeader(titleStack) {
    titleStack.size = new Size(maxLineWidth, normalLineHeight);
    const logo = await getHbLogo();
    const imgWidget = titleStack.addImage(logo);
    imgWidget.imageSize = new Size(40, 30);

    let headerText = addStyledText(titleStack, CONFIGURATION.widgetTitle, headerFont);
    headerText.size = new Size(60, normalLineHeight);
}

function initializeFonts() {
    headerFont = Font.boldMonospacedSystemFont(CONFIGURATION.headerFontSize);
    infoFont = Font.systemFont(CONFIGURATION.informationFontSize);
    chartAxisFont = Font.systemFont(CONFIGURATION.chartAxisFontSize);
    updatedAtFont = Font.systemFont(CONFIGURATION.dateFontSize);
}

async function buildSiriGui(widget, homeBridgeStatus) {
    widget.addSpacer(10);
    let titleStack = widget.addStack();
    await initializeLogoAndHeader(titleStack);
    buildStatusPanelInHeader(titleStack, homeBridgeStatus);
    widget.addSpacer(10);
    let mainColumns = widget.addStack();
    mainColumns.size = new Size(maxLineWidth, 100);

    let verticalStack = mainColumns.addStack();
    verticalStack.layoutVertically();
    if (homeBridgeStatus.hbVersionInfos.updateAvailable || homeBridgeStatus.pluginVersionInfos.updateAvailable || homeBridgeStatus.nodeJsVersionInfos.updateAvailable) {
        speakUpdateStatus(true);
        addStyledText(verticalStack, CONFIGURATION.siriGui_title_update_available, infoFont);
        if (homeBridgeStatus.hbVersionInfos.updateAvailable) {
            verticalStack.addSpacer(5);
            addUpdatableElement(verticalStack, CONFIGURATION.bulletPointIcon + homeBridgeStatus.hbVersionInfos.name + ': ', homeBridgeStatus.hbVersionInfos.installedVersion, homeBridgeStatus.hbVersionInfos.latestVersion);
        }
        if (homeBridgeStatus.pluginVersionInfos.updateAvailable) {
            for (plugin of homeBridgeStatus.pluginVersionInfos.plugins) {
                if (CONFIGURATION.pluginsOrSwUpdatesToIgnore.includes(plugin.name)) {
                    continue;
                }
                if (plugin.updateAvailable) {
                    verticalStack.addSpacer(5);
                    addUpdatableElement(verticalStack, CONFIGURATION.bulletPointIcon + plugin.name + ': ', plugin.installedVersion, plugin.latestVersion);
                }
            }
        }
        if (homeBridgeStatus.nodeJsVersionInfos.updateAvailable) {
            verticalStack.addSpacer(5);
            addUpdatableElement(verticalStack, CONFIGURATION.bulletPointIcon + homeBridgeStatus.nodeJsVersionInfos.name + ': ', homeBridgeStatus.nodeJsVersionInfos.currentVersion, homeBridgeStatus.nodeJsVersionInfos.latestVersion);
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

async function buildUsualGui(widget, homeBridgeStatus) {
    widget.addSpacer(10);
    let titleStack = widget.addStack();
    await initializeLogoAndHeader(titleStack);
    buildStatusPanelInHeader(titleStack, homeBridgeStatus);
    widget.addSpacer(10);
    let cpuData = await fetchData(cpuUrl());
    let ramData = await fetchData(ramUrl());
    let usedRamText = getUsedRamString(ramData);
    let uptimesArray = await getUptimesArray();
    if (cpuData && ramData) {
        let mainColumns = widget.addStack();
        mainColumns.size = new Size(maxLineWidth, 77);
        mainColumns.addSpacer(4)

        let cpuColumn = mainColumns.addStack();
        cpuColumn.layoutVertically();
        addStyledText(cpuColumn, CONFIGURATION.title_cpuLoad + getAsRoundedString(cpuData.currentLoad, 1) + '%', infoFont);
        addChartToWidget(cpuColumn, cpuData.cpuLoadHistory);
        cpuColumn.addSpacer(7);

        let temperatureString = getTemperatureString(cpuData?.cpuTemperature.main);
        if (temperatureString) {
            let cpuTempText = addStyledText(cpuColumn, CONFIGURATION.title_cpuTemp + temperatureString, infoFont);
            cpuTempText.size = new Size(150, 30);
            setTextColor(cpuTempText);
        }

        mainColumns.addSpacer(11);

        let ramColumn = mainColumns.addStack();
        ramColumn.layoutVertically();
        addStyledText(ramColumn, CONFIGURATION.title_ramUsage + usedRamText + '%', infoFont);
        addChartToWidget(ramColumn, ramData.memoryUsageHistory);
        ramColumn.addSpacer(7);

        if (uptimesArray) {
            let uptimesStack = ramColumn.addStack();

            let upStack = uptimesStack.addStack();
            addStyledText(upStack, CONFIGURATION.title_uptimes, infoFont);

            let vertPointsStack = upStack.addStack();
            vertPointsStack.layoutVertically();

            addStyledText(vertPointsStack, CONFIGURATION.bulletPointIcon + CONFIGURATION.title_systemGuiName + uptimesArray[0], infoFont);
            addStyledText(vertPointsStack, CONFIGURATION.bulletPointIcon + CONFIGURATION.title_uiService + uptimesArray[1], infoFont);
        }

        widget.addSpacer(10);

        // BOTTOM UPDATED TEXT //////////////////////
        let updatedAt = addStyledText(widget, 't: ' + timeFormatter.string(new Date()), updatedAtFont);
        updatedAt.centerAlignText();
    }
}

async function buildLockScreenWidgetHeader(widget) {
    let mainStack = widget.addStack();
    const logo = await getHbLogo();
    const imgWidget = mainStack.addImage(logo);
    imgWidget.imageSize = new Size(14, 14);
    addStyledText(mainStack, CONFIGURATION.widgetTitle, headerFont);
}

async function buildLockScreenWidgetBody(widget, homeBridgeStatus) {
    let verticalStack = widget.addStack();
    verticalStack.layoutVertically();
    buildStatusPanelInHeader(verticalStack, homeBridgeStatus);
    await buildCpuRamInfoForLockScreen(verticalStack);
}

function overwriteSizesForLockScreen() {
    infoFont = Font.systemFont(7);
    infoPanelFont = Font.semiboldMonospacedSystemFont(7);
    iconSize = 8;
    CONFIGURATION.spacer_betweenStatusColumns = 2;
    CONFIGURATION.spacer_beforeFirstStatusColumn = 2;
    verticalSpacerInfoPanel = 1;
    timeFormatter.dateFormat = 'HH:mm:ss';
    updatedAtFont = Font.systemFont(6);
}

async function buildCpuRamInfoForLockScreen(verticalStack) {
    let cpuData = await fetchData(cpuUrl());
    let ramData = await fetchData(ramUrl());

    verticalStack.addSpacer(CONFIGURATION.spacer_beforeFirstStatusColumn);
    let statusInfo = verticalStack.addStack();
    let cpuInfos = statusInfo.addStack();

    let cpuFirstColumn = cpuInfos.addStack();
    cpuFirstColumn.layoutVertically();
    addStyledText(cpuFirstColumn, 'CPU:', infoFont);
    cpuInfos.addSpacer(2);

    let cpuSecondColumn = cpuInfos.addStack();
    cpuSecondColumn.layoutVertically();
    addStyledText(cpuSecondColumn, getAsRoundedString(cpuData.currentLoad, 1) + '%', infoFont);
    cpuSecondColumn.addSpacer(2);

    let temperatureString = getTemperatureString(cpuData?.cpuTemperature.main);
    if (temperatureString) {
        addStyledText(cpuSecondColumn, temperatureString, infoFont);
    }

    cpuInfos.addSpacer(17);

    let ramInfos = statusInfo.addStack();
    let usedRamText = getUsedRamString(ramData);

    let ramFirstColumn = cpuInfos.addStack();
    ramFirstColumn.layoutVertically();
    addStyledText(ramFirstColumn, 'RAM:', infoFont);
    cpuInfos.addSpacer(2);
    ramFirstColumn.addSpacer(2);

    let ramSecondColumn = cpuInfos.addStack();
    ramSecondColumn.layoutVertically();
    addStyledText(ramSecondColumn, usedRamText + '%', infoFont);
    ramSecondColumn.addSpacer(5);

    addStyledText(ramSecondColumn, '  t: ' + timeFormatter.string(new Date()), updatedAtFont);
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
}

function checkIfConfigFileParameterIsProvided(givenParameter) {
    if (givenParameter.trim().startsWith('USE_CONFIG:') && givenParameter.trim().endsWith('.json')) {
        configurationFileName = givenParameter.trim().split('USE_CONFIG:')[1];
        if (!fileManager.fileExists(getFilePath(configurationFileName))) {
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

async function fetchData(url) {
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

async function getOverallStatus() {
    const statusData = await fetchData(overallStatusUrl());
    if (statusData === undefined) {
        return undefined;
    }
    return statusData.status === 'up';
}

async function getHomebridgeVersionInfos() {
    if (CONFIGURATION.pluginsOrSwUpdatesToIgnore.includes('HOMEBRIDGE_UTD')) {
        log('You configured Homebridge to not be checked for updates. Widget will show that it\'s UTD!');
        return {updateAvailable: false};
    }
    const hbVersionData = await fetchData(hbVersionUrl());
    if (hbVersionData === undefined) {
        return undefined;
    }
    return hbVersionData;
}

async function getNodeJsVersionInfos() {
    if (CONFIGURATION.pluginsOrSwUpdatesToIgnore.includes('NODEJS_UTD')) {
        log('You configured Node.js to not be checked for updates. Widget will show that it\'s UTD!');
        return {updateAvailable: false};
    }
    const nodeJsData = await fetchData(nodeJsUrl());
    if (nodeJsData === undefined) {
        return undefined;
    }
    nodeJsData.name = 'node.js';
    return nodeJsData;
}

async function getPluginVersionInfos() {
    const pluginsData = await fetchData(pluginsUrl());
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

function getUsedRamString(ramData) {
    if (ramData === undefined) return 'unknown';
    return getAsRoundedString(100 - 100 * ramData.mem.available / ramData.mem.total, 2);
}

async function getUptimesArray() {
    const uptimeData = await fetchData(uptimeUrl());
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

async function getHbLogo() {
    let path = getFilePath(CONFIGURATION.hbLogoFileName);
    if (fileManager.fileExists(path)) {
        const fileDownloaded = await fileManager.isFileDownloaded(path);
        if (!fileDownloaded) {
            await fileManager.downloadFileFromiCloud(path);
        }
        return fileManager.readImage(path);
    } else {
        // logo did not exist -> download it and save it for next time the widget runs
        const logo = await loadImage(CONFIGURATION.logoUrl);
        fileManager.writeImage(path, logo);
        return logo;
    }
}

function getFilePath(fileName) {
    let dirPath = fileManager.joinPath(fileManager.documentsDirectory(), 'homebridgeStatus');
    if (!fileManager.fileExists(dirPath)) {
        fileManager.createDirectory(dirPath);
    }
    return fileManager.joinPath(dirPath, fileName);
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
    if (temperatureInCelsius === undefined || temperatureInCelsius < 0) return undefined;

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
    text.font = infoPanelFont;
    setTextColor(text);
}

async function handleNotifications(hbRunning, hbUtd, pluginsUtd, nodeUtd) {
    if (!CONFIGURATION.notificationEnabled) {
        return;
    }
    let path = getFilePath(CONFIGURATION.notificationJsonFileName);
    let state = await getPersistedObject(path, NOTIFICATION_JSON_VERSION, INITIAL_NOTIFICATION_STATE, true);
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
        persistObject(state, path);
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

async function getPersistedObject(path, versionToCheckAgainst, initialObjectToPersist, createIfNotExisting) {
    if (fileManager.fileExists(path)) {
        const fileDownloaded = await fileManager.isFileDownloaded(path);
        if (!fileDownloaded) {
            await fileManager.downloadFileFromiCloud(path);
        }
        let raw, persistedObject;
        try {
            raw = fileManager.readString(path);
            persistedObject = JSON.parse(raw);
        } catch (e) {
            // file corrupted -> remove it
            fileManager.remove(path);
        }

        if (persistedObject && (persistedObject.jsonVersion === undefined || persistedObject.jsonVersion < versionToCheckAgainst)) {
            log('Unfortunately, the configuration structure changed and your old config is not compatible anymore. It is now renamed, marked as deprecated and a new one is created with the initial configuration. ')
            persistObject(persistedObject, getFilePath('DEPRECATED_' + configurationFileName));
            fileManager.remove(path);
            let migratedConfig = {...initialObjectToPersist, ...persistedObject};
            migratedConfig.jsonVersion = CONFIGURATION_JSON_VERSION;
            persistObject(migratedConfig, path);
            return migratedConfig;
        } else {
            return persistedObject;
        }
    }
    if (createIfNotExisting) {
        // create a new state json
        persistObject(initialObjectToPersist, path);
    }
    return initialObjectToPersist;
}

function persistObject(object, path) {
    let raw = JSON.stringify(object, null, 2);
    fileManager.writeString(path, raw);
}

function addIcon(widget, name, color) {
    let sf = SFSymbol.named(name);
    let iconImage = sf.image;
    let imageWidget = widget.addImage(iconImage);
    imageWidget.resizable = true;
    imageWidget.imageSize = new Size(iconSize, iconSize);
    imageWidget.tintColor = color;
}
