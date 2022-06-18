// import { makeStyles } from "@material-ui/styles";
import PropTypes from "prop-types";
import { Drawer, Typography } from "@material-ui/core";
import clsx from "clsx";
import { SideBarNav } from "./SideBarNav"
import { createMuiTheme } from "@material-ui/core/styles";
import { connect } from 'react-redux';
import GroupIcon from '@material-ui/icons/Group';
import SupervisedUserCircleIcon from '@material-ui/icons/SupervisedUserCircle';
import AssignmentIcon from '@material-ui/icons/Assignment';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import DashboardIcon from '@material-ui/icons/Dashboard';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { makeStyles, useTheme } from "@material-ui/core/styles";

const defaultTheme = createMuiTheme();
const useStyles = makeStyles((theme) => ({
    drawer: {
        width: 240,
        // height: "calc(100% - 100px)",
        elevation: 5,
        // borderRight: "3px solid rgba(0, 0, 0, 0.05)",        
        // margin: "55px 0px",
        backgroundColor: "#FFFFFF",
        transition: "all 0.5s cubic-bezier(0.685, 0.0473, 0.346, 1)",
        [MyComponent()]: {
            // paddingTop: "55px",
        }
    },
    root: {
        backgroundColor: defaultTheme.palette.white,
        display: "flex",
        flexDirection: "column",
        height: "100%",
    },

    nav: {
        marginBottom: defaultTheme.spacing(3),
    },
    userTypeDiv: {
        // height: 50, 
        display: 'flex',
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        borderBottom: "1px solid #E0E0E0",
        padding: "20px 0px 20px 0px"
    },
    userType: {
        fontSize: 20,
        fontFamily: "Futura-Heavy",
        color: "#2687C4",
        fontWeight: "bold",
        textAlign: "center"
    },
    nameStyle: {
        fontSize: 18,
        color: "#000",
        fontFamily: "Futura-Heavy",
        textAlign: "center"
    }
}))

function MyComponent() {
    const theme = useTheme();
    const matches = theme.breakpoints.up('lg');
    return matches;
}

const Sidebar = (props) => {
    const { open, variant, onClose, className, ...rest } = props;
    const classes = useStyles();

    let User = localStorage.getItem('user')
    const userObj = JSON.parse(User);
    let roleName = Object.keys(userObj).length > 0 ? userObj.user_type : null

    let pages = []
    if (roleName !== null) {
        switch (roleName) {
            case "ADM":
                pages = [
                    {
                        title: "Clients",
                        href: "/clients",
                        icon: <GroupIcon />
                    },
                    {
                        title: "Case Managers",
                        href: "/caseManager",
                        icon: <SupervisedUserCircleIcon />
                    },
                    {
                        title: "RBT's",
                        href: "/rbts",
                        icon: <PeopleAltIcon />
                    },
                    {
                        title: "Programs",
                        href: "/programs",
                        icon: <AssignmentIcon />
                    }

                ]
                break;
            case "CLT":
                pages = [
                    {
                        title: "Home",
                        href: "/clientDashBoard",
                        icon: <DashboardIcon />
                    },
                    {
                        title: "Programs",
                        href: "/clientProgram",
                        icon: <AssignmentIcon />
                    },


                ]
                break;
            case "RBT":
                pages = [
                    // {
                    //     title: "Home",
                    //     href: "/rbtDashBoard",
                    //     icon: <DashboardIcon />
                    // },
                    {
                        title: "Clients",
                        href: "/rbts/clients",
                        icon: <GroupIcon />
                    },
                    // {
                    //     title: "Programs",
                    //     href: "/programs",
                    //     icon: <AssignmentIcon />
                    // },
                    {
                        title: "Schedule Calender",
                        href: "/scheduleCalender",
                        icon: <AssignmentIcon />
                    },
                ]
                break;
            case "CMR":
                pages = [
                    // {
                    //     title: "Home",
                    //     href: "/caseManagerDashBoard",
                    //     icon: <DashboardIcon />
                    // },
                    {
                        title: "Clients",
                        href: "/caseManager/clients",
                        icon: <GroupIcon />
                    },
                    {
                        title: "RBT's",
                        href: "/rbts",
                        icon: <PeopleAltIcon />
                    },
                    {
                        title: "Programs",
                        href: "/programs",
                        icon: <AssignmentIcon />
                    }

                ]
                break;
            default:
                pages = [];
        }
    }

    let user = JSON.parse(localStorage.getItem('user'))
    // console.log("user role********" + JSON.stringify(user))
    return (

        <div>
            <Drawer
                PaperProps={{ elevation: 3 }}
                anchor="left"
                classes={{ paper: classes.drawer }}
                onClose={onClose}
                open={open}
                variant={variant}
            >
                <div className={classes.userTypeDiv}>
                    <AccountCircleIcon style={{ color: "#6E83B7", width: 60, height: 60, }} />
                    <Typography className={classes.userType}>
                        {user.user_role_name}
                    </Typography>
                    <Typography className={classes.nameStyle}>
                        {user.first_name} {user.last_name}
                    </Typography>
                </div>
                <div {...rest} className={clsx(classes.root, className)}>
                    <SideBarNav
                        className={classes.nav}
                        pages={pages}
                        onClick={() => variant !== 'persistent' && onClose()}
                    />
                </div>
            </Drawer>
        </div>
    )
}


const mapStateToProps = (state) => {
    return {
        user: state.userReducer.user
    }
}
Sidebar.propTypes = {
    className: PropTypes.string,
    onClose: PropTypes.func,
    open: PropTypes.bool.isRequired,
    variant: PropTypes.string.isRequired,
};

export default connect(mapStateToProps)(Sidebar);