/*
 index.js - ESP3D WebUI navigation tab file

 Copyright (c) 2020 Luc Lebosse. All rights reserved.

 This code is free software; you can redistribute it and/or
 modify it under the terms of the GNU Lesser General Public
 License as published by the Free Software Foundation; either
 version 2.1 of the License, or (at your option) any later version.

 This code is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 Lesser General Public License for more details.

 You should have received a copy of the GNU Lesser General Public
 License along with This code; if not, write to the Free Software
 Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
*/
import { Fragment, h } from "preact"

import { T } from "../../components/Translations"
import { ButtonImg } from "../../components/Controls"
import { Save, ArrowLeft, Eye } from "preact-feather"
import {
    useDatasContext,
    useUiContext,
    useDatasContextFn,
} from "../../contexts"
import header from "./header"
import pioheader from "./pioheader"
import footer from "./footer"
import piofooter from "./piofooter"
import { Version } from "../../components/App/version"
import { useEffect, useState } from "preact/hooks"
const pioIcon = (
    <svg
        width="24"
        height="24"
        viewBox="0 0 256 256"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid"
    >
        <path
            d="M128 0C93.81 0 61.666 13.314 37.49 37.49 13.314 61.666 0 93.81 0 128c0 34.19 13.314 66.334 37.49 90.51C61.666 242.686 93.81 256 128 256c34.19 0 66.334-13.314 90.51-37.49C242.686 194.334 256 162.19 256 128c0-34.19-13.314-66.334-37.49-90.51C194.334 13.314 162.19 0 128 0"
            fill="#5755d9"
        />
        <path
            d="M249.386 128c0 67.04-54.347 121.386-121.386 121.386C60.96 249.386 6.613 195.04 6.613 128 6.613 60.96 60.96 6.614 128 6.614c67.04 0 121.386 54.346 121.386 121.386"
            fill="#FFF"
        />
        <path
            d="M160.869 74.062l5.145-18.537c5.264-.47 9.392-4.886 9.392-10.273 0-5.7-4.62-10.32-10.32-10.32s-10.32 4.62-10.32 10.32c0 3.755 2.013 7.03 5.01 8.837l-5.05 18.195c-14.437-3.67-26.625-3.39-26.625-3.39l-2.258 1.01v140.872l2.258.753c13.614 0 73.177-41.133 73.323-85.27 0-31.624-21.023-45.825-40.555-52.197zM146.53 164.8c-11.617-18.557-6.706-61.751 23.643-67.925 8.32-1.333 18.509 4.134 21.51 16.279 7.582 25.766-37.015 61.845-45.153 51.646zm18.216-39.752a9.399 9.399 0 0 0-9.399 9.399 9.399 9.399 0 0 0 9.4 9.399 9.399 9.399 0 0 0 9.398-9.4 9.399 9.399 0 0 0-9.399-9.398zm2.81 8.672a2.374 2.374 0 1 1 0-4.749 2.374 2.374 0 0 1 0 4.749z"
            fill="#5755d9"
        />
        <path
            d="M101.371 72.709l-5.023-18.901c2.874-1.832 4.786-5.04 4.786-8.701 0-5.7-4.62-10.32-10.32-10.32-5.699 0-10.319 4.62-10.319 10.32 0 5.682 4.592 10.289 10.267 10.317L95.8 74.378c-19.609 6.51-40.885 20.742-40.885 51.88.436 45.01 59.572 85.267 73.186 85.267V68.892s-12.252-.062-26.729 3.817zm10.395 92.09c-8.138 10.2-52.735-25.88-45.154-51.645 3.002-12.145 13.19-17.612 21.511-16.28 30.35 6.175 35.26 49.369 23.643 67.926zm-18.82-39.46a9.399 9.399 0 0 0-9.399 9.398 9.399 9.399 0 0 0 9.4 9.4 9.399 9.399 0 0 0 9.398-9.4 9.399 9.399 0 0 0-9.399-9.399zm-2.81 8.671a2.374 2.374 0 1 1 0-4.748 2.374 2.374 0 0 1 0 4.748z"
            fill="#5755d9"
        />
    </svg>
)

const configurationFile = (data) => {
    return (
        `// This file was generated by ESP3D-Configurator V${Version} \n` +
        header +
        convertToText(data) +
        footer
    )
}

const pioFile = () => {
    return (
        `;This file was generated by ESP3D-Configurator V${Version} \n` +
        pioheader +
        convertPioToText() +
        piofooter
    )
}

const sections = {
    esp32: {
        common:
            "platform = espressif32@4.4.0\n" +
            "board = esp32dev\n" +
            "framework = arduino\n" +
            "monitor_speed = 115200\n" +
            "monitor_flags = --echo\n" +
            "monitor_filters = send_on_enter, colorize, esp32_exception_decoder\n" +
            "; set frequency to 240MHz\n" +
            ";board_build.f_cpu = 240000000L\n" +
            "; set frequency to 80MHz\n" +
            ";board_build.f_flash = 80000000L\n" +
            ";board_build.flash_mode = qio\n" +
            "upload_speed = 460800\n" +
            "extra_scripts = pre:platformIO/extra_script.py\n",
        build_flags: " -DCORE_DEBUG_LEVEL=0\n",
        defaultMosi: 23,
        defaultSck: 18,
        defaultCs: 5,
        defaultMiso: 19,
        defaultSda: 21,
        defaultScl: 22,
    },
    esp32s2: {
        common:
            "platform = espressif32@4.4.0\n" +
            "board = esp32-s2-saola-1\n" +
            "framework = arduino\n" +
            "board_build.mcu = esp32s2\n" +
            "board_build.variant = esp32s2\n" +
            "monitor_speed = 115200\n" +
            "monitor_flags = --echo\n" +
            "monitor_filters = send_on_enter, colorize, esp32_exception_decoder\n" +
            "set frequency to 240MHz\n" +
            "board_build.f_cpu = 240000000L\n" +
            "set frequency to 80MHz\n" +
            "board_build.f_flash = 80000000L\n" +
            "board_build.flash_mode = qio\n" +
            "upload_speed = 460800\n" +
            "extra_scripts = pre:platformIO/extra_script.py\n",
        build_flags:
            " -DCORE_DEBUG_LEVEL=0\n-DARDUINO_USB_CDC_ON_BOOT=0\n-DARDUINO_USB_MSC_ON_BOOT=0\n-DARDUINO_USB_DFU_ON_BOOT=0\n-DCONFIG_IDF_TARGET_ESP32S2=1\n",
        lib_ignore: "TFT_eSPI\n",
        defaultMosi: 35,
        defaultSck: 36,
        defaultCs: 34,
        defaultMiso: 37,
        defaultSda: 8,
        defaultScl: 9,
    },
    esp32s3: {
        common:
            "platform = espressif32@4.4.0\n" +
            "board = esp32-s3-devkitc-1\n" +
            "framework = arduino\n" +
            "board_build.mcu = esp32s3\n" +
            "board_build.variant = esp32s3\n" +
            "monitor_speed = 115200\n" +
            "monitor_flags = --echo\n" +
            "monitor_filters = send_on_enter, colorize, esp32_exception_decoder\n" +
            "set frequency to 240MHz\n" +
            "board_build.f_cpu = 240000000L\n" +
            "set frequency to 80MHz\n" +
            "board_build.f_flash = 80000000L\n" +
            "board_build.flash_mode = qio\n" +
            "upload_speed = 460800\n" +
            "extra_scripts = pre:platformIO/extra_script.py\n",
        build_flags:
            " -DCORE_DEBUG_LEVEL=0\n-DARDUINO_USB_CDC_ON_BOOT=0\n-DARDUINO_USB_MSC_ON_BOOT=0\n-DARDUINO_USB_DFU_ON_BOOT=0\n-DCONFIG_IDF_TARGET_ESP32S3=1\n",
        lib_ignore: "TFT_eSPI\n",
        defaultMosi: 11,
        defaultSck: 12,
        defaultCs: 10,
        defaultMiso: 13,
        defaultSda: 8,
        defaultScl: 9,
    },
    esp32c3: {
        common:
            "platform = espressif32@4.4.0\n" +
            "board =  esp32-c3-devkitm-1\n" +
            "framework = arduino\n" +
            "board_build.mcu = esp32c3\n" +
            "board_build.variant = esp32c3\n" +
            "monitor_speed = 115200\n" +
            "monitor_flags = --echo\n" +
            "monitor_filters = send_on_enter, colorize, esp32_exception_decoder\n" +
            "set frequency to 240MHz\n" +
            "board_build.f_cpu = 240000000L\n" +
            "set frequency to 80MHz\n" +
            "board_build.f_flash = 80000000L\n" +
            "board_build.flash_mode = qio\n" +
            "upload_speed = 460800\n" +
            "extra_scripts = pre:platformIO/extra_script.py\n",
        build_flags: " -DCORE_DEBUG_LEVEL=0\n-DCONFIG_IDF_TARGET_ESP32C3=1\n",
        lib_ignore: "TFT_eSPI\n",
        defaultMosi: 6,
        defaultSck: 4,
        defaultCs: 7,
        defaultMiso: 5,
        defaultSda: 8,
        defaultScl: 9,
    },
    esp8266: {
        common:
            "platform = https://github.com/platformio/platform-espressif8266.git\n" +
            "board = esp12e\n" +
            "framework = arduino\n" +
            "monitor_speed = 115200\n" +
            "monitor_flags = --echo\n" +
            "monitor_filters = send_on_enter, colorize, esp8266_exception_decoder\n" +
            "; set frequency to 160MHz\n" +
            "board_build.f_cpu = 160000000L\n" +
            "; set frequency to 40MHz\n" +
            "board_build.f_flash = 40000000L\n" +
            "board_build.flash_mode = dout\n" +
            "upload_resetmethod = nodemcu\n" +
            "upload_speed = 115200\n" +
            "extra_scripts = pre:platformIO/extra_script.py\n",
        build_flags:
            "  -D PIO_FRAMEWORK_ARDUINO_LWIP2_LOW_MEMORY\n-DNONOSDK221=1\n-DNDEBUG -DVTABLES_IN_FLASH\n-DWAVEFORM_LOCKED_PWM\n",
        lib_ignore: "ESP32SSPD\n",
        defaultMosi: 13,
        defaultSck: 14,
        defaultCs: 15,
        defaultMiso: 12,
        defaultSda: 4,
        defaultScl: 5,
    },
}

const libIgnore = ({
    target,
    targetsize,
    hasWifi,
    hasEthernet,
    hasBT,
    cameraName,
    displayName,
    envName,
}) => {
    return sections[target].lib_ignore
        ? "lib_ignore = " + sections[target].lib_ignore + "\n"
        : ""
}

const cameraBuildFlags = (target, cameraName) => {
    if (cameraName != "-1") {
        return ` -DBOARD_HAS_PSRAM\n${
            target == "esp32" ? " -mfix-esp32-psram-cache-issue\n" : ""
        }`
    }
    return ""
}

const displayBuildFlags = (target, displayName) => {
    if (
        displayName == "TFT_SPI_ST7789_240X240" ||
        displayName == "TFT_SPI_ST7789_135X240"
    ) {
        const width = displayName == "TFT_SPI_ST7789_135X240" ? 135 : 240
        const height = 240
        const rstpin = useDatasContextFn.getValueId("tftRSTpin")
        const dcpin = useDatasContextFn.getValueId("tftDCpin")
        const cspin = useDatasContextFn.getValueId("tftCSpin")
        const mosipin = useDatasContextFn.getValueId("tftMOSIpin")
        const sckpin = useDatasContextFn.getValueId("tftSCKpin")

        const backlightpin = useDatasContextFn.getValueId("tftledpin")
        const defaultMosi = sections[target].defaultMosi
        const defaultSck = sections[target].defaultSck
        const defaultCs = sections[target].defaultCs
        return (
            " -Os\n" +
            "-DUSER_SETUP_LOADED=1\n" +
            "-DST7789_DRIVER=1\n" +
            "-DTFT_SDA_READY=1\n" +
            "-DCGRAM_OFFSET=1\n" +
            `-DTFT_WIDTH=${width}\n` +
            `-DTFT_HEIGHT=${height}\n` +
            `-DTFT_MOSI=${mosipin == "-1" ? defaultMosi : mosipin}\n` +
            `-DTFT_SCLK=${sckpin == "-1" ? defaultSck : sckpin}\n` +
            `-DTFT_CS=${cspin == "-1" ? defaultCs : cspin}\n` +
            `-DTFT_DC=${dcpin}\n` +
            `-DTFT_RST=${rstpin}\n` +
            `-DTFT_BL=${backlightpin}\n` +
            `-DTFT_BACKLIGHT_ON=${backlightpin == "-1" ? 0 : 1}\n` +
            "-DLOAD_GLCD=1\n" +
            "-DLOAD_FONT2=1\n" +
            "-DLOAD_FONT4=1\n" +
            "-DLOAD_FONT6=1\n" +
            "-DLOAD_FONT7=1\n" +
            "-DLOAD_FONT8=1\n" +
            "-DLOAD_GFXFF=1\n" +
            "-DSMOOTH_FONT=1\n" +
            "-DSPI_FREQUENCY=40000000\n" +
            "-DSPI_READ_FREQUENCY=6000000"
        )
    }
    return ""
}

const buildFlags = ({
    target,
    targetsize,
    hasWifi,
    hasEthernet,
    hasBT,
    cameraName,
    displayName,
}) => {
    //todo add Cam
    return (
        "build_flags = " +
        sections[target].build_flags +
        displayBuildFlags(target, displayName) +
        cameraBuildFlags(target, cameraName)
    )
}

const partitionScheme = (target, targetsize, hasWifi, hasEthernet, hasBT) => {
    if (target === "esp8266") {
        switch (targetsize) {
            case "1":
                return "board_build.ldscript = eagle.flash.1m256.ld\n"
            case "2":
                return "board_build.ldscript = eagle.flash.2m256.ld\n"
            case "4":
                return "board_build.ldscript = eagle.flash.4m2m.ld\n"
            case "8":
                return "board_build.ldscript = eagle.flash.8m6m.ld\n"
            case "16":
                return "board_build.ldscript = eagle.flash.16m14m.ld\n"
            default:
                return ""
        }
    } else {
        switch (targetsize) {
            case "2":
                return "board_upload.flash_size = 4MB\nboard_build.partitions = minimal.csv"
            case "4":
                if ((hasWifi || hasEthernet) && hasBT) {
                    return "board_upload.flash_size = 4MB\nboard_build.partitions = min_spiffs.csv\n"
                }
                return "board_upload.flash_size = 4MB\nboard_build.partitions = default.csv\n"
            case "8":
                return "board_upload.flash_size = 8MB\nboard_build.partitions = default_8MB.csv\n"
            case "16":
                return "board_upload.flash_size = 16MB\nboard_build.partitions = large_spiffs_16MB.csv\n"
            default:
                return ""
        }
    }
}

const convertToPioEnv = ({
    target,
    targetsize,
    hasWifi,
    hasEthernet,
    hasBT,
    cameraName,
    displayName,
    envName,
}) => {
    /*
    "build_flags":"build_flags =   -DCORE_DEBUG_LEVEL=0\n",
  
    */
    return (
        "[" +
        envName +
        "]\n" +
        sections[target].common +
        partitionScheme(target, targetsize, hasWifi, hasEthernet, hasBT) +
        libIgnore({
            target,
            targetsize,
            hasWifi,
            hasEthernet,
            hasBT,
            cameraName,
            displayName,
        }) +
        buildFlags({
            target,
            targetsize,
            hasWifi,
            hasEthernet,
            hasBT,
            cameraName,
            displayName,
        })
    )
}

const convertPioToText = () => {
    const target = useDatasContextFn.getValueId("targetmcu")
    const targetsize = useDatasContextFn.getValueId("targetflashsize")
    const hasWifi = useDatasContextFn.getValueId("wifi")
    const hasEthernet = useDatasContextFn.getValueId("ethernet")
    const hasBT = useDatasContextFn.getValueId("bluetooth")
    const cameraName = useDatasContextFn.getValueId("cameratype")
    const displayName = useDatasContextFn.getValueId("displaytype")
    let res = ""
    const envName = `${target}_${targetsize}MB${
        cameraName == "-1" ? "" : "_cam"
    }${displayName == "-1" ? "" : "_disp"}${hasWifi ? "_wifi" : ""}${
        hasEthernet ? "_eth" : ""
    }${hasBT ? "_bt" : ""}`
    return (
        `default_envs = ${envName}\n\n` +
        convertToPioEnv({
            target,
            targetsize,
            hasWifi,
            hasEthernet,
            hasBT,
            cameraName,
            displayName,
            envName,
        })
    )
}

const sectionFormated = (title, description) => {
    return `\n/************************************\n*\n* ${title}\n*\n* ${description}\n*\n************************************/\n`
}

const getLabel = (item, value) => {
    if (item) {
        const index = item.findIndex((element) => {
            return element.value == value
        })
        if (index > -1) return item[index].label
    }
    return null
}

const getHelp = (item, value) => {
    if (item) {
        const index = item.findIndex((element) => {
            return element.value == value
        })
        if (index > -1) return item[index].help
    }
    return null
}

const canshow = (depend, pinvalue, currentvalue) => {
    if (pinvalue && pinvalue != "-1") {
        if (pinvalue == currentvalue && canshow(depend)) return true
        if (usedPinsList.current.includes(pinvalue)) return false
    }
    if (depend) {
        const val = useDatasContextFn.getValueId(depend.id)
        if (depend.value) {
            return depend.value.includes(val)
        }
        if (depend.notvalue) {
            return !depend.notvalue.includes(val)
        }
    }
    return true
}

const convertToText = (data) => {
    //console.log(data)
    let config = ""
    return Object.keys(data).reduce((acc, item) => {
        return data[item].reduce((acc2, item2) => {
            if (item2.type == "group") {
                const content = item2.value.reduce((acc3, element) => {
                    if (!canshow(element.depend)) return acc3
                    if (element.setting) {
                        if (
                            element.value == "-1" ||
                            (!element.value && element.disableiffalse)
                        )
                            return acc3
                        if (element.type == "select") {
                            const help = getHelp(element.options, element.value)
                            const label = getLabel(
                                element.options,
                                element.value
                            )
                            return (
                                acc3 +
                                `\n// ${element.label}\n` +
                                `${
                                    help
                                        ? "// " + help + "\n"
                                        : label
                                        ? "// " + label + "\n"
                                        : ""
                                }` +
                                `${
                                    element.usedescforoptions
                                        ? "// " + element.description + "\n"
                                        : ""
                                }` +
                                `#define ${element.define} ${element.value}\n`
                            )
                        } else if (element.type == "boolean") {
                            return (
                                acc3 +
                                `\n// ${element.label}\n` +
                                `// ${element.description}\n` +
                                `#define ${element.define} ${
                                    !element.disableiffalse ? element.value : ""
                                }\n`
                            )
                        } else if (
                            element.type == "text" ||
                            element.type == "number"
                        ) {
                            return (
                                acc3 +
                                `\n// ${element.label}\n` +
                                `// ${element.description}\n` +
                                `#define ${element.define} ${
                                    element.needquote ? '"' : ""
                                }${element.value}${
                                    element.needquote ? '"' : ""
                                }\n`
                            )
                        } else {
                            console.log(
                                "unknown type",
                                element.type,
                                " for ",
                                element
                            )
                            return (
                                acc3 +
                                `\n// Unknow parameter: ${element.label}\n` +
                                `// ${element.description}\n`
                            )
                        }
                    } else {
                        return (
                            acc3 +
                            `// ${element.label}=${getLabel(
                                element.options,
                                element.value
                            )}\n`
                        )
                    }
                }, "")
                return content.length == 0
                    ? acc2
                    : acc2 +
                          sectionFormated(item2.label, item2.description) +
                          content
            } else {
                console.log("Group definition is missing for " + item2.label)
            }
        }, acc)
    }, config)
}

const exportFile = (filecontent, filename) => {
    const file = new Blob([filecontent], {
        type: "application/txt",
    })
    if (window.navigator.msSaveOrOpenBlob)
        // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename)
    else {
        // Others
        const a = document.createElement("a")
        const url = URL.createObjectURL(file)
        a.href = url
        a.download = filename
        document.body.appendChild(a)
        a.click()
        setTimeout(function () {
            document.body.removeChild(a)
            window.URL.revokeObjectURL(url)
        }, 0)
    }
}

let showconfig = false
let showini = false

const NavButtons = ({ previous, next }) => {
    const { configuration } = useDatasContext()
    return (
        <div style="display:flex;justify-content:space-around">
            {previous && (
                <ButtonImg
                    m2
                    icon={<ArrowLeft />}
                    label="Previous"
                    onclick={() => {
                        if (document.getElementById(previous)) {
                            document.getElementById(previous).click()
                        }
                    }}
                />
            )}
            <ButtonImg
                m2
                icon={<Save />}
                label={T("Download configuration.h")}
                onclick={() => {
                    exportFile(
                        configurationFile(configuration.current),
                        "configuration.h"
                    )
                }}
            />
            <ButtonImg
                m2
                icon={pioIcon}
                label={T("Download platformio.ini")}
                onclick={() => {
                    exportFile(pioFile(), "platformio.ini")
                }}
            />
            <ButtonImg
                m2
                icon={<Eye />}
                label={T("Download WebUI")}
                onclick={() => {
                    const targetfw = useDatasContextFn.getValue(
                        "features",
                        "targetFW",
                        "defaultfw"
                    )
                    const targetFwName = {
                        MARLIN: "Marlin",
                        GRBL: "GRBL",
                        REPETIER: "Repetier",
                        SMOOTHIEWARE: "Smoothieware",
                    }
                    const targetsystem = useDatasContextFn.getValue(
                        "features",
                        "targetFW",
                        "systemtype"
                    )
                    if (targetfw == "UNKNOWN_FW") {
                        window.open(
                            "https://github.com/luc-github/ESP3D-WEBUI/tree/3.0/dist/",
                            "_blank"
                        )
                    } else {
                        window.open(
                            `https://github.com/luc-github/ESP3D-WEBUI/blob/3.0/dist/${targetsystem}/${targetFwName[targetfw]}/index.html.gz?raw=true`,
                            "_blank"
                        )
                    }
                }}
            />
        </div>
    )
}

const GenerateTab = ({ previous }) => {
    const { configuration } = useDatasContext()
    const [showContent, setshowContent] = useState(showconfig)
    const [showIniContent, setshowIniContent] = useState(showini)
    return (
        <div id="generate" class="m-2">
            <NavButtons previous={previous} />
            <div class="accordion">
                <input
                    type="checkbox"
                    id="accordion-1"
                    name="accordion-checkbox"
                    hidden
                />
                <label
                    class="accordion-header"
                    for="accordion-1"
                    style="cursor:pointer"
                    onclick={() => {
                        showconfig = !showconfig
                        setshowContent(showconfig)
                    }}
                >
                    {!showContent && <i class="icon icon-arrow-right mr-1"></i>}
                    {showContent && <i class="icon icon-arrow-down mr-1"></i>}
                    Configuration.h
                </label>
                {showContent && (
                    <div class="accordion-body">
                        <code>
                            <pre>
                                {configurationFile(configuration.current)}
                            </pre>
                        </code>
                    </div>
                )}
            </div>

            <div class="accordion">
                <input
                    type="checkbox"
                    id="accordion-2"
                    name="accordion-checkbox"
                    hidden
                />
                <label
                    class="accordion-header"
                    for="accordion-2"
                    style="cursor:pointer"
                    onclick={() => {
                        showini = !showini
                        setshowIniContent(showini)
                    }}
                >
                    {!showIniContent && (
                        <i class="icon icon-arrow-right mr-1"></i>
                    )}
                    {showIniContent && (
                        <i class="icon icon-arrow-down mr-1"></i>
                    )}
                    platformIO.h
                </label>
                {showIniContent && (
                    <div class="accordion-body">
                        <code>
                            <pre>{pioFile()}</pre>
                        </code>
                    </div>
                )}
                <div class="m-2" />
            </div>

            {showContent && <NavButtons previous={previous} />}
            <br />
        </div>
    )
}

export { GenerateTab }
