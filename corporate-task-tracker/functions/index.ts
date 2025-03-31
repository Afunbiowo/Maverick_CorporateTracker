import * as functions from 'firebase/functions';
import * as admin from 'firebase-admin';
admin.initializeApp();

const db = admin.firestore();

// Scheduled function to check for pending tasks and send reminders
export const checkPendingTasks = functions.pubsub
  .schedule('every 24 hours')
  .timeZone('America/New_York')
  .onRun(async (context) => {
    const now = new Date();
    const threshold = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 24 hours ago

    const tasksSnapshot = await db.collection('tasks')
      .where('status', 'in', ['Pending', 'In Progress'])
      .where('createdAt', '<', threshold)
      .get();

    const usersToNotify = new Set<string>();
    const tasksByUser: Record<string, any[]> = {};

    tasksSnapshot.forEach(doc => {
      const task = doc.data();
      usersToNotify.add(task.createdBy);
      if (!tasksByUser[task.createdBy]) {
        tasksByUser[task.createdBy] = [];
      }
      tasksByUser[task.createdBy].push(task);
    });

    const usersSnapshot = await db.collection('users')
      .where('uid', 'in', Array.from(usersToNotify))
      .get();

    const notificationPromises: Promise<any>[] = [];

    usersSnapshot.forEach(userDoc => {
      const user = userDoc.data();
      const userTasks = tasksByUser[user.uid] || [];
      
      if (userTasks.length > 0 && user.email) {
        // Send email notification
        notificationPromises.push(
          sendEmailNotification(user.email, userTasks)
        );
        
        // Send push notification if token exists
        if (user.fcmToken) {
          notificationPromises.push(
            sendPushNotification(user.fcmToken, userTasks)
          );
        }
      }
    });

    await Promise.all(notificationPromises);
    console.log(`Sent notifications for ${usersToNotify.size} users`);
  });

async function sendEmailNotification(email: string, tasks: any[]) {
  const mailTransport = require('nodemailer').createTransport({
    service: 'gmail',
    auth: {
      user: functions.config().gmail.email,
      pass: functions.config().gmail.password,
    },
  });

  const taskList = tasks.map(task => 
    `- ${task.title} (${task.status})`
  ).join('\n');

  const mailOptions = {
    from: 'Task Tracker <noreply@yourdomain.com>',
    to: email,
    subject: `You have ${tasks.length} pending tasks`,
    text: `You have the following tasks that need attention:\n\n${taskList}\n\nPlease check the Task Tracker app for details.`,
  };

  return mailTransport.sendMail(mailOptions);
}

async function sendPushNotification(fcmToken: string, tasks: any[]) {
  const message = {
    notification: {
      title: `You have ${tasks.length} pending tasks`,
      body: 'Some tasks require your attention',
    },
    token: fcmToken,
  };

  return admin.messaging().send(message);
}