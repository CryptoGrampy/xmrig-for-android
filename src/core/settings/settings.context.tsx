import React, { createContext, Context, useReducer, Dispatch, useEffect, useState } from "react";
import { SettingsActionType } from "./settings.actions";
import { ConfigurationMode, ISettings, ISettingsReducerAction, ISimpleConfiguration, RandomXMode } from "./settings.interface";
import { SettingsReducer } from "./settings.reducer";
import { SettingsStorageInit, SettingsStorageSave } from "./settings.storage";
import uuid from 'react-native-uuid';


const initialState: ISettings = {
    ready: false,
    uuid: uuid.v4().toString(),
    configurations: [],
    selectedConfiguration: undefined
};

export const defaultConfiguration: Partial<ISimpleConfiguration> = {
  properties: {
    cpu: {
      yield: true,
      random_x_mode: RandomXMode.LIGHT,
      max_threads_hint: 100
    }
  }
};

type SettingsContextProps = {
  settings: ISettings,
  settingsDispatcher: Dispatch<ISettingsReducerAction>,
}

export const SettingsContext:Context<SettingsContextProps> = createContext<SettingsContextProps>({settings: initialState, settingsDispatcher: ():void => {}});

export const SettingsContextProvider:React.FC = ({children}) =>  {
    const [settings, settingsDispatcher] = useReducer(SettingsReducer, initialState);
    const [asyncLoaderState, setAsyncLoaderState] = useState<boolean>(false);

    useEffect(() => {
      console.log("settings effect - SettingsStorageInit");
      SettingsStorageInit(initialState)
        .then((value:ISettings) => {
          const fixValue:ISettings = {
            ...value,
            configurations: value.configurations.map((item) => {
              return {
                ...item,
                mode: item.mode as any == "advance" ? ConfigurationMode.ADVANCE : item.mode
              }
            })
          }
          settingsDispatcher({
            type: SettingsActionType.SET,
            value: {
              ...initialState, 
              ...fixValue,
              ready: true
            }
          })
          setAsyncLoaderState(true);
        })
        .catch((e) => console.log(e));
  
    }, []);

    useEffect(() => {
      console.log("state changed", settings, "asyncLoaderState: ", asyncLoaderState);
      if (asyncLoaderState) {
        SettingsStorageSave(settings);
      }
    }, [settings]);

    return (
      <SettingsContext.Provider value={{settings, settingsDispatcher}}>
        {children}
      </SettingsContext.Provider>
    );
}