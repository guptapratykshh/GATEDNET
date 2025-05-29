import React from 'react';
import { Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    DashboardOutlined,
    TeamOutlined,
    BellOutlined,
    CalendarOutlined,
    ToolOutlined,
    CheckSquareOutlined,
    HomeOutlined,
    BarChartOutlined
} from '@ant-design/icons';

const Navigation = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        {
            key: '/dashboard',
            icon: <DashboardOutlined />,
            label: 'Dashboard'
        },
        {
            key: 'member',
            icon: <TeamOutlined />,
            label: 'Member Management',
            children: [
                {
                    key: '/add-member',
                    label: 'Add Member'
                },
                {
                    key: '/update-members',
                    label: 'Update Members'
                },
                {
                    key: '/download-excel',
                    label: 'Download Excel'
                }
            ]
        },
        {
            key: 'announcements',
            icon: <BellOutlined />,
            label: 'Announcements',
            children: [
                {
                    key: '/announcements',
                    label: 'View Announcements'
                },
                {
                    key: '/add-announcement',
                    label: 'Add Announcement'
                }
            ]
        },
        {
            key: 'polls',
            icon: <BarChartOutlined />,
            label: 'Polls',
            children: [
                {
                    key: '/create-poll',
                    label: 'Create Poll'
                },
                {
                    key: '/poll-results',
                    label: 'Poll Results'
                }
            ]
        },
        {
            key: 'amenities',
            icon: <HomeOutlined />,
            label: 'Amenities',
            children: [
                {
                    key: '/view-booked-amenities',
                    label: 'View Bookings'
                }
            ]
        },
        {
            key: 'maintenance',
            icon: <ToolOutlined />,
            label: 'Maintenance',
            children: [
                {
                    key: '/maintenance-updates/add-task',
                    label: 'Add Task'
                },
                {
                    key: '/maintenance-updates/update-task',
                    label: 'Update Task'
                },
                {
                    key: '/maintenance-updates/view-tasks',
                    label: 'View Tasks'
                }
            ]
        }
    ];

    const handleMenuClick = ({ key }) => {
        navigate(key);
    };

    return (
        <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[location.pathname]}
            items={menuItems}
            onClick={handleMenuClick}
            style={{ height: '100%' }}
        />
    );
};

export default Navigation; 