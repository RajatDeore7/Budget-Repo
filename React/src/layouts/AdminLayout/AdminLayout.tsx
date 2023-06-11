// import Topbar from '@/layouts/components/Topbar';
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Topbar } from '@/layouts/components/Topbar/Topbar';
import { Navbar } from '../components/Navbar/Navbar';

const AdminLayout: React.FC<any> = () => {

  return (
    <>
      <Topbar />
      <Navbar />
      <Outlet />
    </>
  );
};

export default AdminLayout;
