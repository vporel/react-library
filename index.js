
import * as react from "react"; export {react};
import * as hooks from "hooks"; export {hooks};
import * as formik from "formik"; export {formik};

/* COMPONENTS */
import * as AddToHomeScreen from "./components/AddToHomeScreen";
import * as AudioRecorder from "./components/AudioRecorder";
import * as Avatar from "./components/Avatar";
import * as Button from "./components/Button";
import * as ChatMessageForm from "./components/ChatMessageForm";
import * as Comment from "./components/Comment";
import * as CropperZone from "./components/CropperZone";
import * as DateCountDown from "./components/DateCountDown";
import * as ExtraOptions from "./components/ExtraOptions";
import * as FilesUploadBox from "./components/FilesUploadBox";
import * as FlexCenter from "./components/FlexCenter";
import * as FloatingComponent from "./components/FloatingComponent";
import * as FloatingComponentOpener from "./components/FloatingComponentOpener";
import * as LinkTag from "./components/LinkTag";
import * as LittleTextForm from "./components/LittleTextForm";
import * as Loader from "./components/Loader";
import * as MessageForm from "./components/MessageForm";
import * as Pagination from "./components/Pagination";
import * as RatingsChoices from "./components/RatingsChoices";
import * as RouterScrollToTop from "./components/RouterScrollToTop";

const components = {
    AddToHomeScreen, AudioRecorder, Avatar, Button, ChatMessageForm, Comment, CropperZone, DateCountDown, 
    ExtraOptions, FilesUploadBox, FlexCenter, FloatingComponent, FloatingComponentOpener, LinkTag, LittleTextForm, 
    Loader, MessageForm, Pagination, RatingsChoices, RouterScrollToTop
}
export {components}

/* CONTEXTS */
import * as DialogBoxesContext from "./contexts/DialogBoxesContext";
import * as ToastContext from "./contexts/ToastContext.jsx";

const contexts = {
    DialogBoxesContext, ToastContext
}
export {contexts}