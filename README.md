# SplitBill Frontend

A modern Next.js frontend for the SplitBill application - making shared expense tracking simple and intuitive.

## Features

- 🎨 Modern, responsive UI built with Tailwind CSS
- 🔐 Secure authentication with NextAuth
- 📱 Mobile-first design
- 🔄 Real-time state management with Redux Toolkit
- 📊 Interactive dashboard with expense tracking
- 👥 Group management and member invitations
- 💰 Expense splitting with multiple categories
- 📈 Settlement calculations showing who owes whom
- 🎯 Intuitive user experience

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js
- **State Management**: Redux Toolkit
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **UI Components**: Headless UI

## Prerequisites

- Node.js 18+
- npm or yarn
- Backend API running (see split-bill-backend)

## Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd splitbill/client
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Update the `.env.local` file with your configuration:

   ```env
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key-change-in-production
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:3000`

## Project Structure

```
client/
├── src/
│   ├── app/                    # App Router pages
│   │   ├── auth/              # Authentication pages
│   │   │   ├── signin/        # Sign in page
│   │   │   └── signup/        # Sign up page
│   │   ├── dashboard/         # Dashboard page
│   │   ├── api/               # API routes
│   │   │   └── auth/          # NextAuth configuration
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   ├── components/            # Reusable components
│   ├── store/                 # Redux store
│   │   ├── slices/           # Redux slices
│   │   │   ├── authSlice.ts  # Authentication state
│   │   │   ├── groupSlice.ts # Group management
│   │   │   └── transactionSlice.ts # Transactions
│   │   ├── hooks.ts          # Typed Redux hooks
│   │   ├── index.ts          # Store configuration
│   │   └── provider.tsx      # Redux provider
│   ├── types/                # TypeScript type definitions
│   └── utils/                # Utility functions
│       └── apiClient.ts      # API client configuration
├── public/                   # Static assets
└── package.json
```

## Key Features

### Authentication

- **Sign Up**: Create new account with email and password
- **Sign In**: Login with existing credentials
- **Session Management**: Secure session handling with NextAuth
- **Protected Routes**: Automatic redirect for unauthenticated users

### Dashboard

- **Overview Stats**: Quick view of groups, expenses, and settlements
- **Group Management**: Create, join, and manage groups
- **Recent Activity**: Track recent transactions and activities
- **Quick Actions**: Easy access to common functions

### Groups

- **Create Groups**: Set up groups for different activities
- **Invite Members**: Share invite codes to add members
- **Member Management**: Admin controls for group members
- **Group Details**: View group information and statistics

### Expenses

- **Add Transactions**: Record expenses with categories
- **Split Methods**: Equal or custom split options
- **Categories**: Food, Transport, Accommodation, Activities, Other
- **Transaction History**: View all group transactions

### Settlements

- **Balance Calculation**: Automatic calculation of who owes whom
- **Settlement Suggestions**: Optimal payment recommendations
- **Mark as Paid**: Track completed settlements
- **Payment History**: View settlement history

## API Integration

The frontend communicates with the backend API through:

- **Authentication**: JWT token-based authentication
- **Groups**: CRUD operations for group management
- **Transactions**: Expense tracking and management
- **Settlements**: Balance calculations and payments
- **Users**: User profile management

## Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler

# Testing
npm run test         # Run tests (if configured)
```

## Environment Variables

| Variable              | Description         | Default                 |
| --------------------- | ------------------- | ----------------------- |
| `NEXTAUTH_URL`        | NextAuth base URL   | `http://localhost:3000` |
| `NEXTAUTH_SECRET`     | NextAuth secret key | Required                |
| `NEXT_PUBLIC_API_URL` | Backend API URL     | `http://localhost:3001` |

## Development

### Adding New Features

1. **Create Components**: Add reusable components in `src/components/`
2. **Update State**: Add new slices or update existing ones in `src/store/slices/`
3. **Add Pages**: Create new pages in `src/app/`
4. **API Integration**: Update API client in `src/utils/apiClient.ts`

### Styling

- Uses Tailwind CSS for utility-first styling
- Responsive design with mobile-first approach
- Custom color palette based on blue theme
- Consistent spacing and typography

### State Management

- Redux Toolkit for predictable state management
- Async thunks for API calls
- Typed hooks for type-safe state access
- Persistent state for authentication

## Deployment

### Vercel (Recommended)

1. **Connect Repository**: Link your GitHub repository to Vercel
2. **Set Environment Variables**: Add production environment variables
3. **Deploy**: Automatic deployment on push to main branch

### Manual Deployment

1. **Build the application**

   ```bash
   npm run build
   ```

2. **Start the production server**
   ```bash
   npm start
   ```

## Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please email support@splitbill.com or create an issue in the repository.

## Acknowledgments

- Built with Next.js and the React ecosystem
- UI inspired by modern financial applications
- Icons provided by Lucide React
- Styling powered by Tailwind CSS
