import mongoose from "mongoose";
import bcrypt from "bcrypt";
import connectDb from "../lib/db.js";

const AdminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    organization: {
      type: String,
      default: "Farmstellar",
    },
    role: {
      type: String,
      enum: ["admin", "superadmin", "moderator"],
      default: "admin",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Admin = mongoose.models.Admin || mongoose.model("Admin", AdminSchema);

const sampleAdmins = [
  {
    name: "Super Admin",
    email: "admin@farmstellar.com",
    password: "123456",
    organization: "Farmstellar HQ",
    role: "superadmin",
  },
  {
    name: "Bhupesh Kumar",
    email: "bhupesh@farmstellar.com",
    password: "bhupesh@2024",
    organization: "Kongu Engineering College",
    role: "admin",
  },
  {
    name: "Rithini",
    email: "rithini@farmstellar.com",
    password: "rithini@2024",
    organization: "Kongu Engineering College",
    role: "admin",
  },
  {
    name: "Sangeetha",
    email: "sangeetha@farmstellar.com",
    password: "sangeetha@2024",
    organization: "Kongu Engineering College",
    role: "moderator",
  },
];

async function seedAdmins() {
  try {
    console.log("Connecting to MongoDB...");
    await connectDb();
    console.log("Connected to MongoDB");

    console.log("\nSeeding admin users...\n");

    for (const adminData of sampleAdmins) {
      // Check if admin already exists
      const existingAdmin = await Admin.findOne({ email: adminData.email });
      if (existingAdmin) {
        console.log(`✓ Admin already exists: ${adminData.email}`);
        continue;
      }

      // Hash password
      const passwordHash = await bcrypt.hash(adminData.password, 10);

      // Create admin
      const admin = new Admin({
        name: adminData.name,
        email: adminData.email,
        passwordHash,
        organization: adminData.organization,
        role: adminData.role,
      });

      await admin.save();
      console.log(`✓ Created admin: ${adminData.email} (${adminData.role})`);
      console.log(`  Password: ${adminData.password}`);
    }

    console.log("\n✅ Admin seeding completed!");
    console.log("\n📋 Admin Credentials:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    sampleAdmins.forEach((admin) => {
      console.log(`${admin.name} (${admin.role})`);
      console.log(`  Email: ${admin.email}`);
      console.log(`  Password: ${admin.password}`);
      console.log("");
    });
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    await mongoose.disconnect();
    console.log("\n✓ Disconnected from MongoDB");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Error seeding admins:", error);
    process.exit(1);
  }
}

seedAdmins();
