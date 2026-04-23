import admin from 'firebase-admin'

function loadServiceAccount() {
  const rawJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON
  if (rawJson) {
    try {
      return JSON.parse(rawJson)
    } catch {
      return null
    }
  }

  const projectId = process.env.FIREBASE_PROJECT_ID
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
  const privateKey = process.env.FIREBASE_PRIVATE_KEY
    ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    : undefined

  if (projectId && clientEmail && privateKey) {
    return { project_id: projectId, client_email: clientEmail, private_key: privateKey }
  }

  return null
}

export function getFirebaseAdminApp() {
  if (admin.apps?.length) {
    return admin.app()
  }

  const serviceAccount = loadServiceAccount()

  if (!serviceAccount) {
    throw new Error(
      'Missing Firebase Admin credentials. Set FIREBASE_SERVICE_ACCOUNT_JSON or FIREBASE_PROJECT_ID/FIREBASE_CLIENT_EMAIL/FIREBASE_PRIVATE_KEY.',
    )
  }

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  })

  return admin.app()
}

export async function verifyFirebaseIdToken(idToken) {
  getFirebaseAdminApp()
  return await admin.auth().verifyIdToken(idToken)
}

