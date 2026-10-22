"use client";

import dynamic from "next/dynamic";
import Link from "next/link";

const AdminClient = dynamic(() => import("./AdminClient"), { ssr: false });

const AdminClientWrapper = () => {
    return (
        <div>
            <div className="border-b bg-white px-6 py-3">
                <Link
                    href="/admin/course-payments"
                    className="text-sm font-semibold text-green-700 hover:text-green-800"
                >
                    Đối soát thanh toán khóa học
                </Link>
            </div>
            <AdminClient />
        </div>
    );
};

export default AdminClientWrapper;
