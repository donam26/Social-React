// page
import Home from "../pages/Home"
import SettingPage from "../pages/SettingPage"
import Friend from "../pages/Friend"
import Messager from "../pages/Messager"
import MessagerDetail from "../pages/MessagerDetail"
import Group from "../pages/Group"
import GroupDetail from "../pages/GroupDetail"
import Profile from "../pages/Profile"
import Login from "../pages/Auth/Login"
import Register from "../pages/Auth/Register"
import FeelDetail from "../pages/FeelDetail"
import Search from "../pages/Search"
import UserDetail from "../pages/UserDetail"
// layouts
import MessagerLayout from "../components/Layouts/MessagerLayout"
import GroupLayout from "../components/Layouts/GroupLayout"
import AuthLayout from "../components/Layouts/AuthLayout"

const privateRoute = [
    // private route
    { path: '/', component: Home },
    { path: '/setting', component: SettingPage },
    { path: '/messager', component: Messager, layout: MessagerLayout },
    { path: '/friend', component: Friend },
    { path: '/messager/:conversationId', component: MessagerDetail,layout: MessagerLayout },    
    { path: '/profile', component: Profile },    
    { path: '/group', component: Group ,layout: GroupLayout },        
    { path: '/group/:groupId', component: GroupDetail,layout: GroupLayout },     
    { path: '/feel/:feelId', component: FeelDetail },  
    { path: '/user/:userId', component: UserDetail },     
    { path: '/search', component: Search },     
]
const publicRoute = [
    // public route
    { path: '/login', component: Login, layout: AuthLayout },
    { path: '/register', component: Register, layout: AuthLayout },
]
export { privateRoute, publicRoute };