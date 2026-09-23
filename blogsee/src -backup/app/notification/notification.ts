import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Notification {
  id: number;
  type: 'query' | 'reply' | 'announcement' | 'update';
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  queryStatus?: 'resolved';
}

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification.html',
  styleUrl: './notification.css'
})
export class NotificationsComponent {

  selectedNotification: Notification | null = null;

  openNotification(notification: Notification): void {
    this.selectedNotification = notification;

    // Automatically mark it as read
    notification.isRead = true;
  }

  closeNotification(): void {
    this.selectedNotification = null;
  }
  notifications: Notification[] = [
    {
      id: 1,
      type: 'query',
      title: '(QRY-121) Resolved',
      message: 'Your query "Unable to access my account" has been successfully resolved.',
      time: '5 minutes ago',
      isRead: false,
      queryStatus: 'resolved'
    },
    {
      id: 2,
      type: 'reply',
      title: 'John Alley Followed You!',
      message: 'John Alley in interested in your account ...',
      time: '2 hours ago',
      isRead: false
    },
    {
      id: 3,
      type: 'announcement',
      title: 'System Announcement',
      message: 'A new dashboard experience is now available.',
      time: 'Yesterday',
      isRead: true
    },
    {
      id: 4,
      type: 'update',
      title: 'New Feature Available',
      message: 'You can now track the progress of your requests more easily.',
      time: '2 days ago',
      isRead: true
    },
    {
      id: 5,
      type: 'query',
      title: 'Query Resolved',
      message: 'Your query "Payment related issue" has been resolved.',
      time: '3 days ago',
      isRead: true,
      queryStatus: 'resolved'
    }
  ];

  activeFilter: 'all' | 'unread' | 'read' = 'all';




  get filteredNotifications(): Notification[] {

    const validNotifications = this.notifications.filter(notification => {

      if (notification.type === 'query') {
        return notification.queryStatus === 'resolved';
      }

      return true;

    });
    if (this.activeFilter === 'unread') {
      return validNotifications.filter(notification => !notification.isRead);
    }

    if (this.activeFilter === 'read') {
      return validNotifications.filter(notification => notification.isRead);
    }

    return validNotifications;
  }

  get unreadCount(): number {
    return this.notifications.filter(notification => !notification.isRead).length;
  }

  setFilter(filter: 'all' | 'unread' | 'read'): void {
    this.activeFilter = filter;
  }

  markAsRead(notification: Notification): void {
    notification.isRead = true;
  }

  markAllAsRead(): void {
    this.notifications.forEach(notification => {
      notification.isRead = true;
    });
  }

  getIcon(type: Notification['type']): string {
    switch (type) {
      case 'query':
        return '✓';

      case 'reply':
        return '💬';

      case 'announcement':
        return '📢';

      case 'update':
        return '✨';

      default:
        return '🔔';
    }
  }
}