
"use client";
import React, { useState , useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useRouter } from "next/navigation";
import {
    Divider,
    List,
    Box,
    ListItem,
    ListItemButton,
    Typography,
    Drawer,

} from '@mui/material';
import { styled } from "@mui/system";


interface navItem {
    label: string;
    icon: string;
    path: string;
    admin: boolean;
}

const AccessControlSection: navItem[] = [
    { label: "Dashboard", icon: "📊", path: "/dashboard", admin: false },
    { label: "Users", icon: "👤", path: "/dashboard/users", admin: false },
    {label : "Schools" , icon : "🌐" , path : "/dashboard/schools" , admin : false},
    {label: "Students" , icon : "🔢" , path : "/dashboard/students" , admin : false}
]


const MonitoringSection: navItem[] = [
    { label: "Subjects", icon: "📚", path: "/dashboard/subjects", admin: false },
    { label: "S.4 Exams", icon: "📊", path: "/dashboard/formFour", admin: false },
    { label: "S.6 Exams", icon: "🛢️", path: "/dashboard/formSix", admin: false },
]

const BillingSection: navItem[] = [
    { label: "Devices", icon: "📟", path: "/devices", admin: false },
    { label: "Consumption", icon: "📊", path: "/Consumption", admin: false },
    { label: "Tank Refills", icon: "🚰", path: "/TankRefills", admin: false },
]

const SettingsSection: navItem[] = [
    { label: "Payments", icon: "💰", path: "/dashboard/scale", admin: false },
]



interface SideNavProps {
    isOpen: boolean;
    actionhandler : (isOpen : boolean) => void;
}

const SideNav: React.FC<SideNavProps> = ({ isOpen , actionhandler }) => {

    const [currentPage, setCurrentPage] = useState<string>("Users");

    const LayoutItem = (component: navItem) => (
        <li>
            <a
                onClick={() => {
                    router.push(component.path)
                    setCurrentPage(component.label)
                }}
                className={cn(
                    "flex items-center space-x-6 p-2 rounded-md transition-colors",
                    "hover:bg-gray-200 dark:hover:bg-gray-700",
                    "cursor-pointer",
                    // currentPage === component.label ? "bg-gray-300 dark:bg-gray-600" : ""
                )}
            >
                <span>{component.icon}</span>
                <span>{component.label}</span>

            </a>
        </li>
    );

    const drawerList = (sections: navItem[]) => (
        <Box sx={{ width: 250 }} role="presentation" onClick={() => actionhandler(false)}>
            <List>
                {sections.map((component) => {
                    // if (component.admin) {
                    //     const role = JSON.parse(localStorage.getItem("User")).role;
                    //     return role == "admin" ? LayoutItem(component) : null;
                    // }
                    return LayoutItem(component);
                })}
            </List>
        </Box>
    );

    const router = useRouter();

    const SectionHeader = styled("div")(({ theme }) => ({
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        width: "20vw",
        height: "9vh",
        // fontcolor: theme.palette.secondary.main,

    }));


    return (
        <Drawer
            style={{
                minHeight: "40vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-around",
                flexGrow: 1,
                maxHeight: "300vh",
                overflowY: "scroll",
                gap: "16px",
                paddingBottom: "16px",
            }}
            open={isOpen}
            onClose={(event) => actionhandler(false)}
        >
            <ul className="space-y-1 p-2 bg-[#FCFBFC] dark:bg-gray-900 border-r border-gray-700 flex-1">
                <br />
                <SectionHeader>
                    <Typography style={{ fontSize: "17px", fontWeight: 'bold' , fontFamily: "figtree" }} variant="h6">
                        General Management
                    </Typography>
                </SectionHeader>
                <Divider />
                {drawerList(AccessControlSection)}

                    <SectionHeader>
                        <Typography style={{ fontSize: "17px", fontWeight: 'bold', fontFamily: "figtree" }} variant="h6">
                            Results Management
                        </Typography>
                    </SectionHeader>
                    <Divider />
                    {drawerList(MonitoringSection)}

                    <SectionHeader>
                        <Typography style={{ fontSize: "17px", fontWeight: 'bold', fontFamily: "figtree" }} variant="h6">
                            Finance Management
                        </Typography>
                    </SectionHeader>
                    <Divider />
                    {drawerList(SettingsSection)}
                    
                </ul>
        </Drawer>
    );
};

export default SideNav;