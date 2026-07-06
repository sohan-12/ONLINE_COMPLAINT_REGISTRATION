const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Name is required'] 
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'],
    unique: true,
  },
  password: { 
    type: String, 
    required: [true, 'Password is required'],
    select: false,
  },
  phone: { 
    type: Number, 
    required: [true, 'Phone is required'] 
  },
  role: { 
    type: String, 
    enum: ["Admin", "Agent", "Ordinary"], 
    default: "Ordinary",
  },
  is_approved: {
    type: Boolean,
    default: function() {
      return this.role !== 'Agent';
    }
  }
}, {
  timestamps: true,
});

// Encrypt password using bcrypt before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
