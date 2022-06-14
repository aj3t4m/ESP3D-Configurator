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
import { Save, ArrowLeft } from "preact-feather"
import { useDatasContext, useUiContext } from "../../contexts"
import header from "./header"
import footer from "./footer"
import { Version } from "../../components/App/version"

const configurationFile = (data) => {
    return header + convertToText(data) + footer
}

const sectionFormated = (title, description) => {
    return `\n/************************************\n*\n* ${title}\n*\n* ${description}\n*\n************************************/\n\n`
}

const getLabel = (item, value) => {
    return item[
        item.findIndex((element) => {
            return element.value == value
        })
    ].label
}

const getHelp = (item, value) => {
    return item[
        item.findIndex((element) => {
            return element.value == value
        })
    ].help
}

const convertToText = (data) => {
    let config = `// This file is generated by ESP3D-Configurator V${Version} \n`
    console.log(data)

    return Object.keys(data).reduce((acc, item) => {
        return data[item].reduce((acc2, item2) => {
            console.log(item2)
            if (item2.type == "group") {
                return (
                    acc2 +
                    sectionFormated(item2.label, item2.description) +
                    item2.value.reduce((acc3, element) => {
                        if (element.setting) {
                            //TODO check if active
                            return (
                                acc3 +
                                `// ${element.label}\n` +
                                `// ${getHelp(
                                    element.options,
                                    element.value
                                )}\n` +
                                `#define ${element.define} ${element.value}\n`
                            )
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
                )
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

const GenerateTab = ({ previous }) => {
    console.log("generate")
    const { configuration } = useDatasContext()
    return (
        <div id="generate">
            <code>
                <pre>{configurationFile(configuration.current)}</pre>
            </code>

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
                    label={T("Download")}
                    onclick={() => {
                        exportFile(
                            configurationFile(configuration.current),
                            "configuration.h"
                        )
                    }}
                />
            </div>
            <br />
        </div>
    )
}

export { GenerateTab }
