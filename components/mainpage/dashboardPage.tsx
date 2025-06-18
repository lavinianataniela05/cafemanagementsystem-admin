"use client";

import { useState, useEffect, useCallback } from "react";
import { 
  Coffee, Clock, MapPin, Phone, Mail, Award, Calendar, Globe, 
  User, Info, ShoppingCart, CreditCard, Menu, X, Star, Heart, 
  Zap, Shield, Users, BarChart2, PieChart, Settings, LogOut, 
  Plus, Minus, Trash2, Edit, ChevronDown, ChevronUp, AlertCircle,
  Leaf, Sparkles,
  DollarSign,
  ArrowUp,
  ShoppingBag,
  LineChart,
  ListFilter
} from "lucide-react";

interface Order {
  id: string;
  customer: string;
  items: {name: string; quantity: number; price: number}[];
  total: number;
  status: "pending" | "preparing" | "ready" | "completed" | "cancelled";
  time: string;
}

interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  cost: number;
  stock: number;
  popularity: number;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  visits: number;
  lastVisit: string;
  totalSpent: number;
}

interface Staff {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  shifts: string[];
}

export default function AdminDashboard() {
  const [currentTime, setCurrentTime] = useState<string>("");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [showEditItemModal, setShowEditItemModal] = useState(false);
  const [currentEditItem, setCurrentEditItem] = useState<MenuItem | null>(null);
  const [newItem, setNewItem] = useState({
    name: "",
    category: "coffee",
    price: 0,
    cost: 0,
    stock: 0
  });

  // Sample data
  const [orders, setOrders] = useState<Order[]>([
    {
      id: "#ORD-001",
      customer: "Sarah Johnson",
      items: [
        {name: "Cinnamon Roll Latte", quantity: 2, price: 28000},
        {name: "Vanilla Bean Latte", quantity: 1, price: 26000}
      ],
      total: 82000,
      status: "ready",
      time: "10:30 AM"
    },
    {
      id: "#ORD-002",
      customer: "Michael Chen",
      items: [
        {name: "Iced Mocha", quantity: 1, price: 27000},
        {name: "Kopi Tubruk", quantity: 1, price: 15000}
      ],
      total: 42000,
      status: "preparing",
      time: "10:45 AM"
    },
    {
      id: "#ORD-003",
      customer: "Emily Rodriguez",
      items: [
        {name: "Cinnamon Roll Latte", quantity: 1, price: 28000},
        {name: "Vanilla Bean Latte", quantity: 1, price: 26000}
      ],
      total: 54000,
      status: "pending",
      time: "11:05 AM"
    },
    {
      id: "#ORD-004",
      customer: "David Kim",
      items: [
        {name: "Iced Mocha", quantity: 2, price: 27000}
      ],
      total: 54000,
      status: "completed",
      time: "9:15 AM"
    },
    {
      id: "#ORD-005",
      customer: "Lisa Wong",
      items: [
        {name: "Kopi Tubruk", quantity: 3, price: 15000}
      ],
      total: 45000,
      status: "completed",
      time: "9:30 AM"
    }
  ]);

  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    {id: "1", name: "Cinnamon Roll Latte", category: "coffee", price: 28000, cost: 8000, stock: 50, popularity: 85},
    {id: "2", name: "Vanilla Bean Latte", category: "coffee", price: 26000, cost: 7500, stock: 45, popularity: 72},
    {id: "3", name: "Iced Mocha", category: "iced", price: 27000, cost: 8500, stock: 30, popularity: 78},
    {id: "4", name: "Kopi Tubruk", category: "traditional", price: 15000, cost: 5000, stock: 60, popularity: 65},
    {id: "5", name: "Matcha Latte", category: "tea", price: 25000, cost: 9000, stock: 25, popularity: 58},
    {id: "6", name: "Chocolate Croissant", category: "food", price: 20000, cost: 7000, stock: 15, popularity: 62}
  ]);

  const [customers, setCustomers] = useState<Customer[]>([
    {id: "1", name: "Sarah Johnson", email: "sarah@example.com", visits: 12, lastVisit: "2023-05-15", totalSpent: 450000},
    {id: "2", name: "Michael Chen", email: "michael@example.com", visits: 8, lastVisit: "2023-05-14", totalSpent: 320000},
    {id: "3", name: "Emily Rodriguez", email: "emily@example.com", visits: 5, lastVisit: "2023-05-12", totalSpent: 180000},
    {id: "4", name: "David Kim", email: "david@example.com", visits: 3, lastVisit: "2023-05-10", totalSpent: 120000},
    {id: "5", name: "Lisa Wong", email: "lisa@example.com", visits: 7, lastVisit: "2023-05-08", totalSpent: 210000}
  ]);

  const [staff, setStaff] = useState<Staff[]>([
    {id: "1", name: "Alex Turner", role: "Manager", email: "alex@brewandbliss.com", phone: "08123456789", shifts: ["Mon-Fri 8AM-4PM"]},
    {id: "2", name: "Jamie Lee", role: "Barista", email: "jamie@brewandbliss.com", phone: "08234567890", shifts: ["Mon-Wed 10AM-6PM", "Sat 12PM-8PM"]},
    {id: "3", name: "Taylor Smith", role: "Barista", email: "taylor@brewandbliss.com", phone: "08345678901", shifts: ["Thu-Sun 7AM-3PM"]},
    {id: "4", name: "Jordan Park", role: "Cashier", email: "jordan@brewandbliss.com", phone: "08456789012", shifts: ["Tue-Sat 9AM-5PM"]}
  ]);

  // Update time every minute
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    
    updateTime();
    const timer = setInterval(updateTime, 60000);
    
    return () => clearInterval(timer);
  }, []);

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  const updateOrderStatus = (orderId: string, newStatus: Order["status"]) => {
    setOrders(orders.map(order => 
      order.id === orderId ? {...order, status: newStatus} : order
    ));
  };

  const addNewItem = () => {
    const newId = (menuItems.length + 1).toString();
    setMenuItems([
      ...menuItems,
      {
        id: newId,
        ...newItem,
        popularity: 0
      }
    ]);
    setShowAddItemModal(false);
    setNewItem({
      name: "",
      category: "coffee",
      price: 0,
      cost: 0,
      stock: 0
    });
  };

  const updateMenuItem = () => {
    if (!currentEditItem) return;
    
    setMenuItems(menuItems.map(item => 
      item.id === currentEditItem.id ? {...currentEditItem} : item
    ));
    setShowEditItemModal(false);
    setCurrentEditItem(null);
  };

  const deleteMenuItem = (id: string) => {
    setMenuItems(menuItems.filter(item => item.id !== id));
  };

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending": return "bg-amber-100 text-amber-800";
      case "preparing": return "bg-orange-100 text-orange-800";
      case "ready": return "bg-green-100 text-green-800";
      case "completed": return "bg-gray-100 text-gray-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  };

  const calculateTodayRevenue = () => {
    return orders
      .filter(order => order.status === "completed")
      .reduce((sum, order) => sum + order.total, 0);
  };

  const calculateTodayOrders = () => {
    return orders.filter(order => order.status === "completed").length;
  };

  const calculatePopularItems = () => {
    return [...menuItems].sort((a, b) => b.popularity - a.popularity).slice(0, 3);
  };

  const calculateStockAlerts = () => {
    return menuItems.filter(item => item.stock < 10);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* Floating decorative elements */}
      <div className="fixed top-20 left-10 w-20 h-20 bg-gradient-to-br from-amber-200/40 to-orange-200/40 rounded-full blur-xl animate-pulse"></div>
      <div className="fixed top-40 right-20 w-16 h-16 bg-gradient-to-br from-rose-200/40 to-pink-200/40 rounded-full blur-lg animate-pulse delay-1000"></div>
      <div className="fixed bottom-32 left-20 w-24 h-24 bg-gradient-to-br from-emerald-200/40 to-green-200/40 rounded-full blur-xl animate-pulse delay-500"></div>
      <div className="fixed bottom-20 right-16 w-12 h-12 bg-gradient-to-br from-blue-200/40 to-indigo-200/40 rounded-full blur-lg animate-pulse delay-700"></div>

      {/* Mobile Menu Button */}
      <button 
        onClick={toggleMenu}
        className="md:hidden fixed top-6 left-6 z-50 bg-white p-3 rounded-xl shadow-lg border border-amber-100"
      >
        {isMenuOpen ? <X className="w-6 h-6 text-amber-700" /> : <Menu className="w-6 h-6 text-amber-700" />}
      </button>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-gradient-to-b from-amber-800 to-orange-800 text-white transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out`}>
        {/* <div className="flex flex-col h-full p-6"> */}
            {/* <div className="flex flex-col h-full p-4 space-y-1 overflow-y-auto"> */}
                  <div className="flex flex-col h-full p-4 space-y-1 overflow-y-auto">


          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-600 to-orange-600 rounded-xl flex items-center justify-center shadow-md">
              <Coffee className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold">Brew & Bliss</span>
            <span className="text-xs bg-amber-500 px-2 py-1 rounded-full ml-auto">Admin</span>
          </div>
          
          <nav className="flex-1 space-y-2">
            <button 
              onClick={() => setActiveTab("dashboard")}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-colors ${activeTab === "dashboard" ? 'bg-amber-600/20 border border-amber-500/30' : 'hover:bg-amber-700/10'}`}
            >
              <BarChart2 className="w-5 h-5" />
              Dashboard
            </button>
            
            <button 
              onClick={() => setActiveTab("orders")}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-colors ${activeTab === "orders" ? 'bg-amber-600/20 border border-amber-500/30' : 'hover:bg-amber-700/10'}`}
            >
              <ShoppingCart className="w-5 h-5" />
              Orders
              <span className="ml-auto bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {orders.filter(o => o.status !== "completed" && o.status !== "cancelled").length}
              </span>
            </button>
            
            <button 
              onClick={() => setActiveTab("menu")}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-colors ${activeTab === "menu" ? 'bg-amber-600/20 border border-amber-500/30' : 'hover:bg-amber-700/10'}`}
            >
              <Coffee className="w-5 h-5" />
              Menu Management
            </button>
            
            <button 
              onClick={() => setActiveTab("customers")}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-colors ${activeTab === "customers" ? 'bg-amber-600/20 border border-amber-500/30' : 'hover:bg-amber-700/10'}`}
            >
              <Users className="w-5 h-5" />
              Customers
            </button>
            
            <button 
              onClick={() => setActiveTab("staff")}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-colors ${activeTab === "staff" ? 'bg-amber-600/20 border border-amber-500/30' : 'hover:bg-amber-700/10'}`}
            >
              <User className="w-5 h-5" />
              Staff Management
            </button>
            
            <button 
              onClick={() => setActiveTab("analytics")}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-colors ${activeTab === "analytics" ? 'bg-amber-600/20 border border-amber-500/30' : 'hover:bg-amber-700/10'}`}
            >
              <PieChart className="w-5 h-5" />
              Analytics
            </button>
            
            <button 
              onClick={() => setActiveTab("settings")}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-colors ${activeTab === "settings" ? 'bg-amber-600/20 border border-amber-500/30' : 'hover:bg-amber-700/10'}`}
            >
              <Settings className="w-5 h-5" />
              Settings
            </button>
          </nav>
          
          <div className="mt-auto pt-6 border-t border-white/10">
            <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-amber-700/10 transition-colors">
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>

          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-orange-500"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="md:ml-0 transition-all duration-100">
        {/* Top Bar */}
        <header className="bg-white shadow-sm border-b border-amber-100">
          <div className="px-6 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-amber-900 capitalize">
              {activeTab.replace(/-/g, ' ')}
            </h1>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-amber-700">
                <Clock className="w-5 h-5" />
                <span className="font-medium">{currentTime}</span>
              </div>
              
              <div className="relative">
                <button className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-md">
                  <User className="w-5 h-5" />
                </button>
                <span className="absolute top-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
            </div>
          ) : (
            <>
              {/* Dashboard Overview */}
              {activeTab === "dashboard" && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-amber-100 hover:shadow-amber-200/50 transition-shadow">
                      <div className="flex items-center justify-between">
                        <h3 className="text-gray-700 font-medium">Today's Revenue</h3>
                        <div className="p-3 rounded-lg bg-amber-100 text-amber-600 shadow-inner">
                          <CreditCard className="w-6 h-6" />
                        </div>
                      </div>
                      <p className="text-3xl font-bold mt-4 text-amber-800">{formatCurrency(calculateTodayRevenue())}</p>
                      <p className="text-sm text-amber-600 mt-2">From {calculateTodayOrders()} orders</p>
                    </div>
                    
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-amber-100 hover:shadow-amber-200/50 transition-shadow">
                      <div className="flex items-center justify-between">
                        <h3 className="text-gray-700 font-medium">Active Orders</h3>
                        <div className="p-3 rounded-lg bg-blue-100 text-blue-600 shadow-inner">
                          <ShoppingCart className="w-6 h-6" />
                        </div>
                      </div>
                      <p className="text-3xl font-bold mt-4 text-amber-800">{orders.filter(o => o.status !== "completed" && o.status !== "cancelled").length}</p>
                      <p className="text-sm text-amber-600 mt-2">In progress</p>
                    </div>
                    
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-amber-100 hover:shadow-amber-200/50 transition-shadow">
                      <div className="flex items-center justify-between">
                        <h3 className="text-gray-700 font-medium">Stock Alerts</h3>
                        <div className="p-3 rounded-lg bg-red-100 text-red-600 shadow-inner">
                          <AlertCircle className="w-6 h-6" />
                        </div>
                      </div>
                      <p className="text-3xl font-bold mt-4 text-amber-800">{calculateStockAlerts().length}</p>
                      <p className="text-sm text-amber-600 mt-2">Items low on stock</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-amber-100">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-amber-900">Recent Orders</h2>
                        <button className="text-sm text-amber-600 hover:text-orange-700 font-medium">
                          View All
                        </button>
                      </div>
                      
                      <div className="space-y-4">
                        {orders.slice(0, 5).map((order) => (
                          <div key={order.id} className="flex items-center justify-between p-4 hover:bg-amber-50 rounded-lg transition-colors border border-amber-100">
                            <div>
                              <p className="font-medium text-amber-900">{order.id}</p>
                              <p className="text-sm text-amber-700">{order.customer}</p>
                            </div>
                            <div>
                              <p className="font-medium text-right text-amber-800">{formatCurrency(order.total)}</p>
                              <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                                {order.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-amber-100">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-amber-900">Popular Items</h2>
                        <button className="text-sm text-amber-600 hover:text-orange-700 font-medium">
                          View All
                        </button>
                      </div>
                      
                      <div className="space-y-4">
                        {calculatePopularItems().map((item) => (
                          <div key={item.id} className="flex items-center gap-4 p-3 hover:bg-amber-50 rounded-lg transition-colors">
                            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600">
                              <Coffee className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-amber-900">{item.name}</p>
                              <p className="text-sm text-amber-700">{item.category}</p>
                            </div>
                            <div className="w-12 h-12">
                              <div className="relative w-full h-full">
                                <svg className="w-full h-full" viewBox="0 0 36 36">
                                  <path
                                    d="M18 2.0845
                                      a 15.9155 15.9155 0 0 1 0 31.831
                                      a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke="#FEF3C7"
                                    strokeWidth="3"
                                  />
                                  <path
                                    d="M18 2.0845
                                      a 15.9155 15.9155 0 0 1 0 31.831
                                      a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke="#F59E0B"
                                    strokeWidth="3"
                                    strokeDasharray={`${item.popularity}, 100`}
                                  />
                                </svg>
                                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-xs font-bold text-amber-700">
                                  {item.popularity}%
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Orders Management */}
              {activeTab === "orders" && (
                <div className="bg-white rounded-xl shadow-sm border border-amber-100 overflow-hidden">
                  <div className="p-6 border-b border-amber-100 flex items-center justify-between bg-gradient-to-r from-amber-50 to-orange-50">
                    <h2 className="text-lg font-bold text-amber-900">Order Management</h2>
                    <div className="flex items-center gap-3">
                      <select className="bg-amber-50 border border-amber-200 text-amber-800 py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500">
                        <option>All Status</option>
                        <option>Pending</option>
                        <option>Preparing</option>
                        <option>Ready</option>
                        <option>Completed</option>
                        <option>Cancelled</option>
                      </select>
                      <input
                        type="text"
                        placeholder="Search orders..."
                        className="bg-amber-50 border border-amber-200 text-amber-800 py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      />
                    </div>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-amber-100">
                      <thead className="bg-amber-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">Order ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">Customer</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">Items</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">Total</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">Time</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-amber-100">
                        {orders.map((order) => (
                          <tr key={order.id} className="hover:bg-amber-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-amber-900">{order.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-800">{order.customer}</td>
                            <td className="px-6 py-4 text-sm text-amber-800">
                              <div className="flex flex-wrap gap-1">
                                {order.items.map((item, i) => (
                                  <span key={i} className="bg-amber-100 px-2 py-1 rounded text-xs text-amber-800">
                                    {item.quantity}x {item.name}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-amber-900">{formatCurrency(order.total)}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-800">{order.time}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex items-center gap-2">
                                {order.status === "pending" && (
                                  <button 
                                    onClick={() => updateOrderStatus(order.id, "preparing")}
                                    className="text-blue-600 hover:text-blue-800"
                                  >
                                    Start Prep
                                  </button>
                                )}
                                {order.status === "preparing" && (
                                  <button 
                                    onClick={() => updateOrderStatus(order.id, "ready")}
                                    className="text-green-600 hover:text-green-800"
                                  >
                                    Mark Ready
                                  </button>
                                )}
                                {order.status === "ready" && (
                                  <button 
                                    onClick={() => updateOrderStatus(order.id, "completed")}
                                    className="text-gray-600 hover:text-gray-800"
                                  >
                                    Complete
                                  </button>
                                )}
                                {(order.status === "pending" || order.status === "preparing") && (
                                  <button 
                                    onClick={() => updateOrderStatus(order.id, "cancelled")}
                                    className="text-red-600 hover:text-red-800 ml-2"
                                  >
                                    Cancel
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="px-6 py-4 border-t border-amber-100 flex items-center justify-between bg-amber-50">
                    <div className="text-sm text-amber-700">
                      Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of <span className="font-medium">20</span> results
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="px-3 py-1 border border-amber-200 rounded-lg text-sm hover:bg-amber-100 text-amber-700">
                        Previous
                      </button>
                      <button className="px-3 py-1 bg-amber-500 text-white rounded-lg text-sm hover:bg-amber-600">
                        1
                      </button>
                      <button className="px-3 py-1 border border-amber-200 rounded-lg text-sm hover:bg-amber-100 text-amber-700">
                        2
                      </button>
                      <button className="px-3 py-1 border border-amber-200 rounded-lg text-sm hover:bg-amber-100 text-amber-700">
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Menu Management */}
              {activeTab === "menu" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-amber-900">Menu Management</h2>
                    <button 
                      onClick={() => setShowAddItemModal(true)}
                      className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      Add New Item
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {menuItems.map((item) => (
                      <div key={item.id} className="bg-white rounded-xl shadow-sm border border-amber-100 overflow-hidden hover:shadow-amber-200/50 transition-shadow">
                        <div className={`h-3 ${item.stock < 10 ? 'bg-red-500' : 'bg-green-500'}`}></div>
                        <div className="p-6">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-lg font-bold text-amber-900">{item.name}</h3>
                              <span className="inline-block px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs mt-1">
                                {item.category}
                              </span>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-amber-600">{formatCurrency(item.price)}</p>
                              <p className="text-xs text-amber-600">Cost: {formatCurrency(item.cost)}</p>
                            </div>
                          </div>
                          
                          <div className="mt-6 grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-amber-700">Stock</p>
                              <p className="font-medium text-amber-900">{item.stock}</p>
                            </div>
                            <div>
                              <p className="text-sm text-amber-700">Popularity</p>
                              <div className="flex items-center gap-2">
                                <div className="w-full bg-amber-200 rounded-full h-2">
                                  <div 
                                    className="bg-amber-500 h-2 rounded-full" 
                                    style={{ width: `${item.popularity}%` }}
                                  ></div>
                                </div>
                                <span className="text-xs text-amber-700">{item.popularity}%</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-6 flex items-center gap-2">
                            <button 
                              onClick={() => {
                                setCurrentEditItem(item);
                                setShowEditItemModal(true);
                              }}
                              className="flex-1 flex items-center justify-center gap-2 bg-amber-100 hover:bg-amber-200 text-amber-700 px-4 py-2 rounded-lg transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                              Edit
                            </button>
                            <button 
                              onClick={() => deleteMenuItem(item.id)}
                              className="flex-1 flex items-center justify-center gap-2 bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Customers Management */}
              {activeTab === "customers" && (
                <div className="bg-white rounded-xl shadow-sm border border-amber-100 overflow-hidden">
                  <div className="p-6 border-b border-amber-100 flex items-center justify-between bg-gradient-to-r from-amber-50 to-orange-50">
                    <h2 className="text-lg font-bold text-amber-900">Customer Management</h2>
                    <input
                      type="text"
                      placeholder="Search customers..."
                      className="bg-amber-50 border border-amber-200 text-amber-800 py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-amber-100">
                      <thead className="bg-amber-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">Customer</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">Email</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">Visits</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">Last Visit</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">Total Spent</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-amber-100">
                        {customers.map((customer) => (
                          <tr key={customer.id} className="hover:bg-amber-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                                  <User className="w-5 h-5" />
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-amber-900">{customer.name}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-800">{customer.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-800">{customer.visits}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-800">{customer.lastVisit}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-amber-900">{formatCurrency(customer.totalSpent)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button className="text-amber-600 hover:text-orange-700">View Details</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              
              {/* Staff Management */}
              {activeTab === "staff" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-amber-900">Staff Management</h2>
                    <button className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all">
                      <Plus className="w-4 h-4" />
                      Add Staff Member
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {staff.map((person) => (
                      <div key={person.id} className="bg-white rounded-xl shadow-sm border border-amber-100 overflow-hidden hover:shadow-amber-200/50 transition-shadow">
                        <div className="p-6">
                          <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 h-14 w-14 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shadow-inner">
                              <User className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-lg font-bold text-amber-900">{person.name}</h3>
                              <span className="inline-block px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs mt-1">
                                {person.role}
                              </span>
                            </div>
                          </div>
                          
                          <div className="mt-6 space-y-3">
                            <div className="flex items-center gap-3">
                              <Mail className="w-5 h-5 text-amber-500" />
                              <p className="text-amber-800">{person.email}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <Phone className="w-5 h-5 text-amber-500" />
                              <p className="text-amber-800">{person.phone}</p>
                            </div>
                          </div>
                          
                          <div className="mt-6">
                            <h4 className="text-sm font-medium text-amber-700 mb-2">Shifts</h4>
                            <div className="space-y-2">
                              {person.shifts.map((shift, i) => (
                                <div key={i} className="bg-amber-50 px-3 py-2 rounded-lg text-sm text-amber-800">
                                  {shift}
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div className="mt-6 flex items-center gap-2">
                            <button className="flex-1 flex items-center justify-center gap-2 bg-amber-100 hover:bg-amber-200 text-amber-700 px-4 py-2 rounded-lg transition-colors">
                              <Edit className="w-4 h-4" />
                              Edit
                            </button>
                            <button className="flex-1 flex items-center justify-center gap-2 bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg transition-colors">
                              <Trash2 className="w-4 h-4" />
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Analytics */}
{activeTab === "analytics" && (
  <div className="space-y-8">
    {/* Stats Cards Row */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-xl shadow-sm border border-amber-100">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-amber-700">Total Revenue</h3>
          {/* <DollarSign className="w-5 h-5 text-amber-500" /> */}
        </div>
        <p className="mt-2 text-3xl font-bold text-amber-900">Rp.19.250.568</p>
        <p className="mt-1 text-sm flex items-center text-green-600">
          <ArrowUp className="w-4 h-4 mr-1" /> 12.5% from last month
        </p>
      </div>
      
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-xl shadow-sm border border-amber-100">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-amber-700">Customers</h3>
          <Users className="w-5 h-5 text-amber-500" />
        </div>
        <p className="mt-2 text-3xl font-bold text-amber-900">1,248</p>
        <p className="mt-1 text-sm flex items-center text-green-600">
          <ArrowUp className="w-4 h-4 mr-1" /> 8.3% from last month
        </p>
      </div>
      
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-xl shadow-sm border border-amber-100">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-amber-700">Orders</h3>
          <ShoppingBag className="w-5 h-5 text-amber-500" />
        </div>
        <p className="mt-2 text-3xl font-bold text-amber-900">342</p>
        <p className="mt-1 text-sm flex items-center text-green-600">
          <ArrowUp className="w-4 h-4 mr-1" /> 5.2% from last month
        </p>
      </div>
      
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-xl shadow-sm border border-amber-100">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-amber-700">Avg. Order</h3>
          <CreditCard className="w-5 h-5 text-amber-500" />
        </div>
        <p className="mt-2 text-3xl font-bold text-amber-900">Rp.250.083</p>
        <p className="mt-1 text-sm flex items-center text-green-600">
          <ArrowUp className="w-4 h-4 mr-1" /> 3.1% from last month
        </p>
      </div>
    </div>

    {/* Main Charts Section */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Sales Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-amber-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-amber-900">Sales Overview</h3>
          <select className="text-sm border border-amber-200 rounded-lg px-3 py-1 bg-amber-50 text-amber-800 focus:ring-2 focus:ring-amber-500 focus:border-amber-500">
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>Last 3 Months</option>
          </select>
        </div>
        <div className="h-64">
          {/* Replace with your actual chart component */}
          <div className="h-full bg-gradient-to-b from-amber-50 to-white rounded-lg flex items-center justify-center">
            <div className="text-center">
              <LineChart className="w-12 h-12 mx-auto text-amber-400" />
              <p className="mt-2 text-amber-500">Sales trend visualization</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Top Selling Items */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-amber-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-amber-900">Top Selling Items</h3>
          <button className="text-sm flex items-center gap-1 text-amber-600 hover:text-amber-800">
            <ListFilter className="w-4 h-4" />
            Filter
          </button>
        </div>
        <div className="space-y-4">
          {menuItems
            .sort((a, b) => b.popularity - a.popularity)
            .slice(0, 5)
            .map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-3 hover:bg-amber-50 rounded-lg transition-colors">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600 shrink-0">
                  <Coffee className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-amber-900 truncate">{item.name}</p>
                  <p className="text-sm text-amber-700 truncate">{item.category}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-amber-800">{formatCurrency(item.price)}</p>
                  <div className="flex items-center justify-end">
                    <div className="w-16 bg-amber-200 rounded-full h-1.5 mr-2">
                      <div 
                        className="bg-amber-600 h-1.5 rounded-full" 
                        style={{ width: `${item.popularity}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-medium text-amber-700">{item.popularity}%</span>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
    
    {/* Customer Traffic */}
    <div className="bg-white p-6 rounded-xl shadow-sm border border-amber-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-amber-900">Customer Traffic</h3>
        <div className="flex gap-2">
          <button className="px-3 py-1 text-sm bg-amber-100 text-amber-800 rounded-lg">Daily</button>
          <button className="px-3 py-1 text-sm hover:bg-amber-100 text-amber-600 rounded-lg">Weekly</button>
          <button className="px-3 py-1 text-sm hover:bg-amber-100 text-amber-600 rounded-lg">Monthly</button>
        </div>
      </div>
      <div className="h-80">
        {/* Replace with your actual chart component */}
        <div className="h-full bg-gradient-to-b from-amber-50 to-white rounded-lg flex items-center justify-center">
          <div className="text-center">
            <BarChart2 className="w-12 h-12 mx-auto text-amber-400" />
            <p className="mt-2 text-amber-500">Customer traffic visualization</p>
          </div>
        </div>
      </div>
    </div>
  </div>
)}
              
              {/* Settings */}
              {activeTab === "settings" && (
                <div className="bg-white rounded-xl shadow-sm border border-amber-100 overflow-hidden">
                  <div className="p-6 border-b border-amber-100 bg-gradient-to-r from-amber-50 to-orange-50">
                    <h2 className="text-lg font-bold text-amber-900">Cafe Settings</h2>
                  </div>
                  
                  <div className="divide-y divide-amber-100">
                    <div className="p-6">
                      <h3 className="font-medium mb-4 text-amber-900">General Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-amber-700 mb-1">Cafe Name</label>
                          <input
                            type="text"
                            defaultValue="Brew & Bliss"
                            className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-amber-700"
                            // className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-amber-700 mb-1">Phone Number</label>
                          <input
                            type="text"
                            defaultValue="(555) 123-BREW"
                            className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-amber-700"
                            // className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-amber-700 mb-1">Address</label>
                          <input
                            type="text"
                            defaultValue="123 Coffee Street, Downtown, CA 90210"
                            className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-amber-700"
                            // className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-amber-700 mb-1">Email</label>
                          <input
                            type="email"
                            defaultValue="hello@brewandbliss.com"
                            className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-amber-700"
                            // className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="font-medium mb-4 text-amber-900">Opening Hours</h3>
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <div className="w-24 text-amber-700">Monday - Friday</div>
                          <input
                            type="text"
                            defaultValue="7:00 AM"
                            className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-amber-700"
                            // className="w-24 px-3 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                          />
                          <span className="text-amber-700">to</span>
                          <input
                            type="text"
                            defaultValue="7:00 PM"
                            className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-amber-700"
                            // className="w-24 px-3 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                          />
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="w-24 text-amber-700">Saturday - Sunday</div>
                          <input
                            type="text"
                            defaultValue="8:00 AM"
                            className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-amber-700"
                            // className="w-24 px-3 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                          />
                          <span className="text-amber-700">to</span>
                          <input
                            type="text"
                            defaultValue="6:00 PM"
                            className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-amber-700"
                            // className="w-24 px-3 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="font-medium mb-4 text-amber-900">Theme Settings</h3>
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-amber-500"></div>
                          <span className="text-amber-700">Primary Color</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-orange-500"></div>
                          <span className="text-amber-700">Secondary Color</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-amber-100"></div>
                          <span className="text-amber-700">Background</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6 flex justify-end bg-amber-50/50">
                      <button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-all">
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Add Item Modal */}
      {showAddItemModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 border border-amber-100 overflow-hidden">
            <div className="p-6 border-b border-amber-100 flex items-center justify-between bg-gradient-to-r from-amber-50 to-orange-50">
              <h3 className="text-lg font-bold text-amber-900">Add New Menu Item</h3>
              <button 
                onClick={() => setShowAddItemModal(false)}
                className="text-amber-600 hover:text-orange-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-amber-700 mb-1">Item Name</label>
                <input
                  type="text"
                  value={newItem.name}
                  onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                  className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-amber-700"
                  // className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="e.g. Cinnamon Roll Latte"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-amber-700 mb-1">Category</label>
                <select
                  value={newItem.category}
                  onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                  className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                >
                  <option value="coffee">Coffee</option>
                  <option value="non-coffee">Non-Coffee</option>
                  <option value="pastry">Pastry</option>
                  <option value="indonesian">Indonesian</option>
                  <option value="western">Western</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-amber-700 mb-1">Price (Rp)</label>
                  <input
                    type="number"
                    value={newItem.price}
                    onChange={(e) => setNewItem({...newItem, price: Number(e.target.value)})}
                    className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-amber-700"
                    // className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    placeholder="28000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-amber-700 mb-1">Cost (Rp)</label>
                  <input
                    type="number"
                    value={newItem.cost}
                    onChange={(e) => setNewItem({...newItem, cost: Number(e.target.value)})}
                    className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-amber-700"
                    // className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    placeholder="8000"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-amber-700 mb-1">Initial Stock</label>
                <input
                  type="number"
                  value={newItem.stock}
                  onChange={(e) => setNewItem({...newItem, stock: Number(e.target.value)})}
                  className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-amber-700"
                  // className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="50"
                />
              </div>
            </div>
            
            <div className="p-6 border-t border-amber-100 flex justify-end gap-3 bg-amber-50/50">
              <button 
                onClick={() => setShowAddItemModal(false)}
                className="px-4 py-2 border border-amber-200 text-amber-700 rounded-lg hover:bg-amber-100 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={addNewItem}
                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 hover:to-orange-600 shadow-md transition-all"
              >
                Add Item
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Edit Item Modal */}
      {showEditItemModal && currentEditItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 border border-amber-100 overflow-hidden">
            <div className="p-6 border-b border-amber-100 flex items-center justify-between bg-gradient-to-r from-amber-50 to-orange-50">
              <h3 className="text-lg font-bold text-amber-900">Edit Menu Item</h3>
              <button 
                onClick={() => setShowEditItemModal(false)}
                className="text-amber-600 hover:text-orange-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-amber-700 mb-1">Item Name</label>
                <input
                  type="text"
                  value={currentEditItem.name}
                  onChange={(e) => setCurrentEditItem({...currentEditItem, name: e.target.value})}
                  className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-amber-700 mb-1">Category</label>
                <select
                  value={currentEditItem.category}
                  onChange={(e) => setCurrentEditItem({...currentEditItem, category: e.target.value})}
                  className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                >
                  <option value="coffee">Coffee</option>
                  <option value="tea">Tea</option>
                  <option value="iced">Iced Beverages</option>
                  <option value="traditional">Traditional</option>
                  <option value="food">Food</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-amber-700 mb-1">Price (Rp)</label>
                  <input
                    type="number"
                    value={currentEditItem.price}
                    onChange={(e) => setCurrentEditItem({...currentEditItem, price: Number(e.target.value)})}
                    className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-amber-700 mb-1">Cost (Rp)</label>
                  <input
                    type="number"
                    value={currentEditItem.cost}
                    onChange={(e) => setCurrentEditItem({...currentEditItem, cost: Number(e.target.value)})}
                    className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-amber-700 mb-1">Stock</label>
                  <input
                    type="number"
                    value={currentEditItem.stock}
                    onChange={(e) => setCurrentEditItem({...currentEditItem, stock: Number(e.target.value)})}
                    className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-amber-700 mb-1">Popularity</label>
                  <input
                    type="number"
                    value={currentEditItem.popularity}
                    onChange={(e) => setCurrentEditItem({...currentEditItem, popularity: Number(e.target.value)})}
                    className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    min="0"
                    max="100"
                  />
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-amber-100 flex justify-end gap-3 bg-amber-50/50">
              <button 
                onClick={() => setShowEditItemModal(false)}
                className="px-4 py-2 border border-amber-200 text-amber-700 rounded-lg hover:bg-amber-100 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={updateMenuItem}
                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 hover:to-orange-600 shadow-md transition-all"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}