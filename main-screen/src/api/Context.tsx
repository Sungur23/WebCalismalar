import React, {FC, PropsWithChildren, useState} from "react";
import {Api} from "./SimulationAPI";

export function prepareContext() {
    const isDev = process.env.NODE_ENV !== "production";
    return {
        version: 0,
        isDev,
        contextChanged: () => {
        },
        services: {
            api: new Api({
                baseUrl: "http://localhost:3001",
                baseApiParams: {format: "json"}
            })
        }
    }
}

export const context = prepareContext();