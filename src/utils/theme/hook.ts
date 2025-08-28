import * as React from "react";
import {ThemeContext} from "./context.ts";


export const useTheme = () => React.useContext(ThemeContext);