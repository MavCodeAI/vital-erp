import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, Check, CheckCheck, Trash2, Package, ShoppingCart, Users, AlertTriangle, DollarSign, FileText, LucideIcon } from "lucide-react";

interface Notification {
  id: string;
  type: "info" | "warning" | "success" | "error";
  category: "sales" | "purchase" | "inventory" | "hr" | "system";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  icon: LucideIcon;
}

const initialNotifications: Notification[] = [
  {
    id: "1",
    type: "warning",
    category: "inventory",
    title: "Low Stock Alert",
    message: "Laptop Pro 15 stock is below reorder level (5 units remaining)",
    timestamp: "2 minutes ago",
    read: false,
    icon: Package
  },
  {
    id: "2",
    type: "success",
    category: "sales",
    title: "New Invoice Paid",
    message: "Invoice INV-001 has been paid by Karachi Corporation",
    timestamp: "15 minutes ago",
    read: false,
    icon: DollarSign
  },
  {
    id: "3",
    type: "info",
    category: "purchase",
    title: "Purchase Order Approved",
    message: "PO-045 has been approved and sent to supplier",
    timestamp: "1 hour ago",
    read: false,
    icon: ShoppingCart
  },
  {
    id: "4",
    type: "error",
    category: "system",
    title: "Failed Login Attempt",
    message: "Multiple failed login attempts detected from IP 203.0.113.45",
    timestamp: "2 hours ago",
    read: true,
    icon: AlertTriangle
  },
  {
    id: "5",
    type: "info",
    category: "hr",
    title: "Leave Request",
    message: "Hassan Raza has requested leave from Jan 20-25",
    timestamp: "3 hours ago",
    read: true,
    icon: Users
  },
  {
    id: "6",
    type: "success",
    category: "sales",
    title: "New Order Received",
    message: "New order #ORD-234 received from Lahore Tech Solutions",
    timestamp: "5 hours ago",
    read: true,
    icon: FileText
  },
];

export function NotificationsCenter() {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const unreadCount = notifications.filter(n => !n.read).length;

  const filteredNotifications = filter === "unread" 
    ? notifications.filter(n => !n.read)
    : notifications;

  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const handleDelete = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const getTypeColor = (type: string) => {
    const colors = {
      info: "bg-blue-500/10 text-blue-600",
      warning: "bg-yellow-500/10 text-yellow-600",
      success: "bg-green-500/10 text-green-600",
      error: "bg-red-500/10 text-red-600"
    };
    return colors[type as keyof typeof colors] || colors.info;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96 p-0">
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h3 className="font-semibold">Notifications</h3>
            <p className="text-xs text-muted-foreground">
              {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              disabled={unreadCount === 0}
            >
              <CheckCheck className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              disabled={notifications.length === 0}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex gap-2 p-2 border-b">
          <Button
            variant={filter === "all" ? "default" : "ghost"}
            size="sm"
            onClick={() => setFilter("all")}
            className="flex-1"
          >
            All
          </Button>
          <Button
            variant={filter === "unread" ? "default" : "ghost"}
            size="sm"
            onClick={() => setFilter("unread")}
            className="flex-1"
          >
            Unread ({unreadCount})
          </Button>
        </div>

        <ScrollArea className="h-[400px]">
          {filteredNotifications.length > 0 ? (
            <div className="p-2 space-y-2">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg border transition-colors ${
                    notification.read ? 'bg-muted/30' : 'bg-background hover:bg-muted/50'
                  }`}
                >
                  <div className="flex gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg flex-shrink-0 ${getTypeColor(notification.type)}`}>
                      <notification.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm truncate">{notification.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
                          <p className="text-xs text-muted-foreground mt-2">{notification.timestamp}</p>
                        </div>
                        <div className="flex gap-1 flex-shrink-0">
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => handleMarkAsRead(notification.id)}
                              title="Mark as read"
                            >
                              <Check className="h-3 w-3" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleDelete(notification.id)}
                            title="Delete"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[400px] text-center p-4">
              <Bell className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="font-semibold">No notifications</p>
              <p className="text-sm text-muted-foreground">
                {filter === "unread" ? "All caught up!" : "You're all set!"}
              </p>
            </div>
          )}
        </ScrollArea>

        {filteredNotifications.length > 0 && (
          <>
            <Separator />
            <div className="p-2">
              <Button variant="ghost" className="w-full text-sm" size="sm">
                View All Notifications
              </Button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
