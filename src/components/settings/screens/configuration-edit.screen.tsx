import { useRoute } from "@react-navigation/native";
import React from "react";
import { View } from "react-native";
import { useTheme } from "react-native-paper";
import { SettingsActionType, SettingsContext } from "../../../core/settings";
import { Configuration, ConfigurationMode, IAdvanceConfiguration, ISimpleConfiguration } from "../../../core/settings/settings.interface";
import { ConfigurationEditAdvance } from "../containers/configurations/edit-advance";
import { ConfigurationEditSimple } from "../containers/configurations/edit-simple";


const ConfigurationEditScreen = () => {
    const route = useRoute();
    const theme = useTheme();

    const {settings, settingsDispatcher} = React.useContext(SettingsContext);
    const [configuration, setConfiguration] = React.useState<Configuration>();
    React.useEffect(() => {
        setConfiguration(settings.configurations.find(item => item.id === (route.params as any).id))
    }, [route.params])

    return (
        <View style={{backgroundColor: theme.colors.background}}>
            {configuration?.mode === ConfigurationMode.SIMPLE && 
                <ConfigurationEditSimple 
                    configuration={configuration} 
                    onUpdate={(configurationData: ISimpleConfiguration) => {
                        console.log(configurationData)
                        settingsDispatcher({
                            type: SettingsActionType.UPDATE_CONFIGURATION, 
                            value: configurationData
                        })
                    }}
                />
            }
            {configuration?.mode === ConfigurationMode.ADVANCE && 
                <ConfigurationEditAdvance 
                    configuration={configuration} 
                    onUpdate={(configurationData: IAdvanceConfiguration) => {
                        console.log(configurationData)
                        settingsDispatcher({
                            type: SettingsActionType.UPDATE_CONFIGURATION, 
                            value: configurationData
                        })
                    }}
                />
            }
        </View>
    );
  }

export default ConfigurationEditScreen