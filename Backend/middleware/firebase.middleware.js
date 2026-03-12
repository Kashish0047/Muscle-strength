import admin from 'firebase-admin';
import User from '../models/user.model.js';
import Admin from '../models/admin.model.js';


export const initializeFirebase = () => {
    console.log('Initializing Firebase...');
    console.log('Project ID:', process.env.FIREBASE_PROJECT_ID);
    console.log('Private Key exists:', !!process.env.FIREBASE_PRIVATE_KEY);
    
    const serviceAccount = {
        "type": "service_account",
        "project_id": process.env.FIREBASE_PROJECT_ID,
        "private_key_id": process.env.FIREBASE_PRIVATE_KEY_ID,
        "private_key": process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : '',
        "client_email": process.env.FIREBASE_CLIENT_EMAIL,
        "client_id": process.env.FIREBASE_CLIENT_ID,
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token"
    };

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
    
    console.log('Firebase initialized successfully');
};


export const authenticateFirebaseUser = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: 'Access denied. No Firebase token provided.' 
            });
        }

       
        const decodedToken = await admin.auth().verifyIdToken(token);
        const firebaseUid = decodedToken.uid;
        
        
        let user = await User.findOne({ Email: decodedToken.email });
        
        if (!user) {
          
            user = new User({
                Name: decodedToken.name || 'User',
                Email: decodedToken.email,
                Phone: decodedToken.phone_number || '',
                Address: {
                    street: '',
                    city: '',
                    state: '',
                    pincode: '',
                    country: 'India'
                },
                Orders: [],
                Cart: [],
                Wishlist: [],
                isActive: true,
                firebaseUid: firebaseUid 
            });
            
            await user.save();
        } else if (!user.isActive) {
            return res.status(401).json({ 
                success: false, 
                message: 'Account is deactivated.' 
            });
        }

        req.user = user;
        req.firebaseUser = decodedToken;
        next();
    } catch (error) {
        console.error('Firebase auth error:', error);
        
        if (error.code === 'auth/id-token-expired') {
            return res.status(401).json({ 
                success: false, 
                message: 'Firebase token expired.' 
            });
        }
        
        if (error.code === 'auth/id-token-revoked') {
            return res.status(401).json({ 
                success: false, 
                message: 'Firebase token revoked.' 
            });
        }
        
        if (error.code === 'auth/invalid-id-token') {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid Firebase token.' 
            });
        }
        
        res.status(500).json({ 
            success: false, 
            message: 'Server error in Firebase authentication.' 
        });
    }
};

// Middleware for admin using email check
export const authenticateAdmin = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: 'Access denied. No Firebase token provided.' 
            });
        }

        const decodedToken = await admin.auth().verifyIdToken(token);
        
        // Check if user is admin by email
        const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'bodysupplement29@gmail.com';
        if (decodedToken.email !== ADMIN_EMAIL) {
            return res.status(403).json({ 
                success: false, 
                message: 'Access denied. Admin privileges required.' 
            });
        }

        // Find or create admin in database
        let adminUser = await Admin.findOne({ email: decodedToken.email });
        if (!adminUser) {
            adminUser = new Admin({
                Name: decodedToken.name || 'Admin',
                email: decodedToken.email,
                isActive: true,
                firebaseUid: decodedToken.uid
            });
            await adminUser.save();
        } else if (!adminUser.isActive) {
            return res.status(401).json({ 
                success: false, 
                message: 'Admin account is inactive.' 
            });
        }

        req.admin = adminUser;
        req.firebaseUser = decodedToken;
        next();
    } catch (error) {
        console.error('Firebase admin auth error:', error);
        res.status(401).json({ 
            success: false, 
            message: 'Invalid admin token.' 
        });
    }
};
