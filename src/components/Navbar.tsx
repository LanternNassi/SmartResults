"use client";
import React, { useState } from 'react';
import SideNav from './SideNav';
import { Button, Badge } from '@mui/material';
import AppsIcon from "@mui/icons-material/Apps";
import { VerifiedUser, Notifications, GradeOutlined } from "@mui/icons-material";
import { Toaster } from "@/components/ui/sonner";
import GradeSettings from './GradeScale';
import { useRouter } from 'next/navigation';

interface NavbarProps {
    children?: React.ReactNode;
}

const Navbar: React.FC<NavbarProps> = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [openGradeScale, setOpenGradeScale] = useState(false);
    const notificationCount = 3;

    const router = useRouter();

    const actionhandler = (isOpen: boolean) => {
        setIsOpen(isOpen);
    }

    return (
        <div className="flex h-screen bg-primary dark:bg-primary-dark text-black dark:text-white">
            {/* Sidebar */}
            <SideNav isOpen={isOpen} actionhandler={actionhandler} />

            {/* Main Content */}
            <main className="flex-1 flex flex-col">
                {/* Header */}
                <header className="bg-[#FCFBFC] dark:bg-gray-900 border-b border-gray-300 dark:border-gray-700 shadow-sm">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col md:flex-row items-center justify-between h-16">
                            {/* Left Section */}
                            <div className="flex items-center space-x-4">

                                <div className="flex items-center space-x-2">
                                    <Button
                                        variant="contained"
                                        size="medium"
                                        startIcon={<AppsIcon />}
                                        onClick={() => setIsOpen(true)}
                                        sx={{
                                            bgcolor: '#635fc7',
                                            '&:hover': { bgcolor: '#4e4bb9' },
                                            textTransform: 'none',
                                            fontWeight: 600
                                        }}
                                    >
                                        Menu
                                    </Button>
                                </div>

                                {/* Center - Title */}
                                <div className="text-2xl font-bold text-center text-black dark:text-white order-first md:order-none mb-4 md:mb-0 mt-4 md:mt-0">
                                    SMART RESULTS
                                </div>

                            </div>

                            {/* Right Section */}
                            <div className="flex items-center space-x-3">
                                <Badge badgeContent={notificationCount} color="error" overlap="circular">
                                    <Button
                                        variant="contained"
                                        startIcon={<Notifications />}
                                        sx={{
                                            bgcolor: '#2d2d39',
                                            '&:hover': { bgcolor: '#3e3e4a' },
                                            textTransform: 'none'
                                        }}
                                    >
                                        Notifications
                                    </Button>
                                </Badge>

                                <Button
                                    variant="contained"
                                    startIcon={<GradeOutlined />}
                                    onClick={() => setOpenGradeScale(true)}
                                    sx={{
                                        bgcolor: '#2d2d39',
                                        '&:hover': { bgcolor: '#3e3e4a' },
                                        textTransform: 'none'
                                    }}
                                >
                                    Grading System
                                </Button>

                                <Button
                                    endIcon={<VerifiedUser />}
                                    variant="contained"
                                    onClick={() =>{
                                        //logout
                                        localStorage.removeItem('user');
                                        document.cookie = "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                                        router.push('/login')
                                    }}
                                    sx={{
                                        bgcolor: '#635fc7',
                                        '&:hover': { bgcolor: '#4e4bb9' },
                                        textTransform: 'none',
                                        fontWeight: 500,
                                        ml: 2
                                    }}
                                >
                                    {JSON.parse(localStorage.getItem('user') || '{}')?.name || 'User'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 p-6 bg-[#FCFBFC] dark:bg-gray-900 overflow-y-auto">
                    {children}
                </div>

                <Toaster />

                <GradeSettings onClose={() => setOpenGradeScale(false)} open={openGradeScale} />
            </main>
        </div>
    )
}

export default Navbar