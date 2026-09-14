const admin = require('firebase-admin');
admin.initializeApp({
  projectId: 'ai-studio-portalinfosistem-a938b2d7-f250-4897-abde-e17eefa6067b'
});
const db = admin.firestore();

async function check() {
  const dir = await db.collection('direktori').get();
  console.log('direktori size:', dir.size);
  
  const users = await db.collection('users').get();
  console.log('users size:', users.size);
  
  const pkgs = await db.collection('packages').get();
  console.log('packages size:', pkgs.size);
}
check().catch(console.error);
