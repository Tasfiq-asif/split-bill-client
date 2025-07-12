"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchGroups } from "@/store/slices/groupSlice";
import {
  Receipt,
  Users,
  Plus,
  Settings,
  LogOut,
  DollarSign,
  Calendar,
  CreditCard,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { groups, isLoading } = useAppSelector((state) => state.groups);
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      dispatch(fetchGroups());
    }
  }, [session, dispatch]);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 17) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Receipt className="h-8 w-8 text-blue-600 mr-2" />
              <h1 className="text-2xl font-bold text-gray-900">SplitBill</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                {greeting}, {session.user?.name}
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <LogOut className="h-5 w-5 mr-1" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Active Groups
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {groups.length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Expenses
                </p>
                <p className="text-2xl font-bold text-gray-900">$0.00</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <CreditCard className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">You Owe</p>
                <p className="text-2xl font-bold text-gray-900">$0.00</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Owed to You</p>
                <p className="text-2xl font-bold text-gray-900">$0.00</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Groups Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Your Groups
                  </h2>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Group
                  </button>
                </div>
              </div>
              <div className="p-6">
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : groups.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No groups yet
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Create your first group to start splitting expenses with
                      friends
                    </p>
                    <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
                      Create Your First Group
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {groups.map((group) => (
                      <div
                        key={group._id}
                        className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-gray-900">
                              {group.name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {group.description}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {group.members.length} members
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">
                              $0.00
                            </p>
                            <p className="text-xs text-gray-500">total spent</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 flex items-center justify-center">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Expense
                </button>
                <button className="w-full bg-green-600 text-white p-3 rounded-md hover:bg-green-700 flex items-center justify-center">
                  <Users className="h-4 w-4 mr-2" />
                  Join Group
                </button>
                <button className="w-full bg-purple-600 text-white p-3 rounded-md hover:bg-purple-700 flex items-center justify-center">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Settle Up
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Recent Activity
              </h3>
              <div className="space-y-3">
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">No recent activity</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
