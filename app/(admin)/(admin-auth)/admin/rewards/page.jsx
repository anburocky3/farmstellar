"use client";

import { useState, useEffect, useCallback } from "react";
import {
  ArrowLeft,
  Package,
  CheckCircle,
  XCircle,
  FileText,
  Truck,
  Clock,
  User,
  MapPin,
  Phone,
  Mail,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

export default function AdminRewardsScreen() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showBillModal, setShowBillModal] = useState(false);
  const [billHTML, setBillHTML] = useState("");
  const [approvalForm, setApprovalForm] = useState({
    trackingNumber: "",
    adminNotes: "",
  });
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    delivered: 0,
  });

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("farmstellar_admin_token");

      const statusParam = filter === "all" ? "" : `?status=${filter}`;
      const res = await fetch(`/api/admin/purchase-orders${statusParam}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        const ordersList = Array.isArray(data.orders) ? data.orders : [];
        setOrders(ordersList);

        const pending = ordersList.filter((o) => o.status === "pending").length;
        const approved = ordersList.filter(
          (o) => o.status === "approved"
        ).length;
        const rejected = ordersList.filter(
          (o) => o.status === "rejected"
        ).length;
        const delivered = ordersList.filter(
          (o) => o.status === "delivered"
        ).length;

        setStats({ pending, approved, rejected, delivered });
      } else {
        console.error("Failed to fetch orders:", res.status);
        setOrders([]);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      if (isMounted) {
        await fetchOrders();
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [fetchOrders]);

  const handleApprove = (order) => {
    setSelectedOrder(order);
    setApprovalForm({
      trackingNumber: "",
      adminNotes: "",
    });
    setShowApprovalModal(true);
  };

  const confirmApprove = async () => {
    try {
      const token = localStorage.getItem("farmstellar_admin_token");

      const res = await fetch(
        `/api/admin/purchase-orders/${selectedOrder._id}/approve`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(approvalForm),
        }
      );

      if (res.ok) {
        const data = await res.json();
        alert(`Order approved! Bill Number: ${data.billNumber}`);
        setShowApprovalModal(false);
        setSelectedOrder(null);
        fetchOrders();
      } else {
        const error = await res.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error("Error approving order:", error);
      alert("Failed to approve order");
    }
  };

  const handleReject = async (order) => {
    const reason = prompt("Enter rejection reason:");
    if (!reason) return;

    try {
      const token = localStorage.getItem("farmstellar_admin_token");

      const res = await fetch(
        `/api/admin/purchase-orders/${order._id}/reject`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ adminNotes: reason }),
        }
      );

      if (res.ok) {
        const data = await res.json();
        alert(`Order rejected. ${data.refundedXP} XP refunded to farmer.`);
        fetchOrders();
      } else {
        const error = await res.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error("Error rejecting order:", error);
      alert("Failed to reject order");
    }
  };

  const handleMarkDelivered = async (order) => {
    if (!confirm("Mark this order as delivered?")) return;

    try {
      const token = localStorage.getItem("farmstellar_admin_token");

      const res = await fetch(
        `/api/admin/purchase-orders/${order._id}/deliver`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        alert("Order marked as delivered!");
        fetchOrders();
      } else {
        const error = await res.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error("Error marking as delivered:", error);
      alert("Failed to mark as delivered");
    }
  };

  const viewBill = async (order) => {
    try {
      const token = localStorage.getItem("farmstellar_admin_token");

      const res = await fetch(`/api/admin/purchase-orders/${order._id}/bill`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const html = await res.text();
        setBillHTML(html);
        setShowBillModal(true);
      } else {
        alert("Bill not available yet");
      }
    } catch (error) {
      console.error("Error fetching bill:", error);
      alert("Failed to load bill");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
      case "approved":
        return "bg-green-500/10 text-green-600 border-green-500/20";
      case "rejected":
        return "bg-red-500/10 text-red-600 border-red-500/20";
      case "delivered":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-500/20";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "approved":
        return <CheckCircle className="w-4 h-4" />;
      case "rejected":
        return <XCircle className="w-4 h-4" />;
      case "delivered":
        return <Truck className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href={"/admin/dashboard"}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
                aria-label="Go back"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Reward Order Management
                </h1>
                <p className="text-sm text-muted-foreground">
                  Approve farmer redemptions and manage deliveries
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 rounded-xl p-4 border border-yellow-500/20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {stats.pending}
                </p>
                <p className="text-sm text-muted-foreground">
                  Pending Approval
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-xl p-4 border border-green-500/20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {stats.approved}
                </p>
                <p className="text-sm text-muted-foreground">Approved</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-500/10 to-red-500/5 rounded-xl p-4 border border-red-500/20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500/20 rounded-lg">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {stats.rejected}
                </p>
                <p className="text-sm text-muted-foreground">Rejected</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs - WITHOUT delivered */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {["pending", "approved", "rejected", "all"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-xl font-medium transition-colors whitespace-nowrap ${
                filter === tab
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground hover:bg-muted/80"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-card rounded-2xl p-12 text-center border border-border">
              <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium text-foreground mb-2">
                No orders found
              </p>
              <p className="text-sm text-muted-foreground">
                No {filter} orders at the moment
              </p>
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order._id}
                className="bg-card rounded-2xl p-6 border border-border hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-lg font-bold text-foreground">
                        #{order.billNumber || "N/A"}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {getStatusIcon(order.status)}
                        {(order.status || "unknown").toUpperCase()}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </div>

                    {/* Farmer Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          {order.userId?.name || "Unknown"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">
                          {order.userId?.phone || "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">
                          {order.userId?.email || "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">
                          {order.userId?.city || "N/A"}
                        </span>
                      </div>
                    </div>

                    {/* Items */}
                    <div className="mb-4">
                      <p className="text-sm font-medium text-foreground mb-2">
                        Items:
                      </p>
                      <div className="space-y-2">
                        {(order.items || []).map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-3 bg-background rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">
                                {item.icon || "📦"}
                              </span>
                              <div>
                                <p className="font-medium text-sm">
                                  {item.name || "Unknown Item"}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Qty: {item.quantity || 1}
                                </p>
                              </div>
                            </div>
                            <span className="text-sm font-bold text-accent">
                              {(item.xpCost || 0) * (item.quantity || 1)} XP
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Delivery Address */}
                    <div className="p-3 bg-background rounded-lg mb-4">
                      <p className="text-xs font-medium text-muted-foreground mb-1">
                        Delivery Address:
                      </p>
                      <p className="text-sm text-foreground">
                        {typeof order.deliveryAddress === "string"
                          ? order.deliveryAddress
                          : order.deliveryAddress
                          ? `${order.deliveryAddress.name || ""}, ${
                              order.deliveryAddress.address || ""
                            }, ${order.deliveryAddress.city || ""}, ${
                              order.deliveryAddress.state || ""
                            } ${order.deliveryAddress.pincode || ""}`.trim()
                          : "N/A"}
                      </p>
                    </div>

                    {/* Total */}
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg border border-primary/20">
                      <span className="font-bold text-foreground">
                        Total XP:
                      </span>
                      <span className="text-2xl font-bold text-primary">
                        {order.totalXP || 0} XP
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-4 pt-4 border-t border-border">
                  {order.status === "pending" && (
                    <>
                      <button
                        onClick={() => handleApprove(order)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Approve & Generate Bill
                      </button>
                      <button
                        onClick={() => handleReject(order)}
                        className="px-4 py-2 border border-red-500 text-red-500 rounded-lg font-medium hover:bg-red-500/10 transition-colors"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </>
                  )}

                  {order.status === "approved" && (
                    <button
                      onClick={() => viewBill(order)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                    >
                      <FileText className="w-4 h-4" />
                      View Bill
                    </button>
                  )}

                  {(order.status === "delivered" ||
                    order.status === "rejected") && (
                    <button
                      onClick={() => viewBill(order)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-muted text-foreground rounded-lg font-medium hover:bg-muted/80 transition-colors"
                      disabled={order.status === "rejected"}
                    >
                      <FileText className="w-4 h-4" />
                      {order.status === "rejected"
                        ? "No Bill (Rejected)"
                        : "View Bill"}
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Approval Modal */}
      {showApprovalModal && selectedOrder && (
        <>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setShowApprovalModal(false)}
          />
          <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-2xl mx-auto bg-card rounded-2xl shadow-xl z-50">
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-green-500" />
                Approve Order #{selectedOrder.billNumber || "N/A"}
              </h2>
            </div>

            <div className="p-6 space-y-4">
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <p className="text-sm text-foreground mb-2">
                  <strong>Action:</strong> Approving this order will:
                </p>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
                  <li>
                    Deduct <strong>{selectedOrder.totalXP || 0} XP</strong> from
                    farmer (already reserved)
                  </li>
                  <li>Generate official bill with admin e-signature</li>
                  <li>Add items to farmer&apos;s purchased rewards</li>
                  <li>Send bill to farmer</li>
                </ul>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Tracking Number (Optional)
                </label>
                <input
                  type="text"
                  value={approvalForm.trackingNumber}
                  onChange={(e) =>
                    setApprovalForm({
                      ...approvalForm,
                      trackingNumber: e.target.value,
                    })
                  }
                  placeholder="e.g., TRACK123456"
                  className="w-full px-4 py-2 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Admin Notes (Optional)
                </label>
                <textarea
                  value={approvalForm.adminNotes}
                  onChange={(e) =>
                    setApprovalForm({
                      ...approvalForm,
                      adminNotes: e.target.value,
                    })
                  }
                  placeholder="Add any notes for this order..."
                  rows={3}
                  className="w-full px-4 py-2 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={confirmApprove}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-colors"
                >
                  <CheckCircle className="w-4 h-4" />
                  Approve & Generate Bill
                </button>
                <button
                  onClick={() => setShowApprovalModal(false)}
                  className="px-4 py-3 border border-border rounded-xl font-medium hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Bill Modal */}
      {showBillModal && (
        <>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setShowBillModal(false)}
          />
          <div className="fixed inset-8 bg-white rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col">
            <div className="p-4 bg-card border-b border-border flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground">
                Generated Bill
              </h2>
              <button
                onClick={() => setShowBillModal(false)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-auto">
              <iframe
                srcDoc={billHTML}
                className="w-full h-full border-0"
                title="Bill Preview"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
