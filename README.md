# ErpMax Pakistan - Enterprise Resource Planning System

A modern, comprehensive ERP system built for Pakistani businesses, featuring sales management, inventory tracking, accounting, HR, and more.

## 🚀 Features

- **Authentication**: Secure user authentication with Supabase Auth
- **Sales Management**: Complete sales order and invoice management
- **Inventory Control**: Real-time stock tracking and reorder management
- **Dashboard**: Analytics and business insights
- **Multi-tenant Architecture**: Support for multiple organizations
- **Modern UI**: Built with React, TypeScript, and Tailwind CSS
- **Real-time Updates**: Powered by Supabase and React Query

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Components**: shadcn/ui, Radix UI, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **State Management**: React Query (TanStack Query)
- **Charts**: Recharts
- **Icons**: Lucide React
- **Build Tools**: Vite, ESLint, PostCSS

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account and project

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <YOUR_GIT_URL>
cd vital-erp-main
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Copy the environment template and configure your Supabase credentials:

```bash
cp .env.example .env
```

Update `.env` with your Supabase project details:

```env
VITE_SUPABASE_URL="https://your-project-id.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="your-supabase-publishable-key"
VITE_SUPABASE_PROJECT_ID="your-project-id"
```

### 4. Database Setup

Ensure your Supabase project has the following tables (or run the provided migrations):

- `profiles` - User profiles and metadata
- `tenants` - Multi-tenant organization data
- `user_roles` - Role-based access control
- `sales` - Sales orders and invoices
- `customers` - Customer management
- `inventory` - Product and stock management

### 5. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── sales/          # Sales-specific components
│   ├── layout/         # Layout components (Header, Sidebar)
│   └── ui/             # Base UI components (shadcn/ui)
├── hooks/              # Custom React hooks
│   ├── useAuth.ts      # Authentication hook
│   └── useSupabaseQuery.ts  # Database query hooks
├── integrations/       # External service integrations
│   └── supabase/       # Supabase client and types
├── lib/                # Utility functions
├── pages/              # Page components
└── types/              # TypeScript type definitions
```

## 🔐 Authentication

The app uses Supabase Auth for secure authentication:

- **Login/Signup**: Email/password authentication
- **Session Management**: Automatic token refresh
- **Protected Routes**: Route guards for authenticated users
- **User Metadata**: Store additional user information

## 📊 Data Management

### Using Supabase Queries

```typescript
import { useSupabaseQuery } from '@/hooks/useSupabaseQuery';

// Fetch data
const { data: sales, isLoading, error } = useSupabaseQuery('sales', {
  select: '*',
  orderBy: { column: 'created_at', ascending: false },
  filter: { status: 'active' }
});
```

### Mutations

```typescript
import { useSupabaseMutation } from '@/hooks/useSupabaseQuery';

const createSale = useSupabaseMutation('sales', 'insert');

await createSale.mutateAsync({
  customer_name: 'John Doe',
  total_amount: 1000,
  status: 'pending'
});
```

## 🎨 UI Components

The project uses shadcn/ui components with custom theming:

- **Consistent Design**: Unified design system
- **Responsive**: Mobile-first approach
- **Accessible**: WCAG compliant components
- **Customizable**: Easy to extend and modify

## 📦 Build & Deploy

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Deployment Options

1. **Vercel** (Recommended)
   ```bash
   npm install -g vercel
   vercel
   ```

2. **Netlify**
   ```bash
   npm run build
   # Deploy the `dist` folder to Netlify
   ```

3. **Docker**
   ```bash
   docker build -t erpmax .
   docker run -p 80:80 erpmax
   ```

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Quality

- **TypeScript**: Full type safety
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting (configured with ESLint)

### Environment Variables

All environment variables must be prefixed with `VITE_` to be exposed to the frontend:

```env
VITE_SUPABASE_URL=...
VITE_SUPABASE_PUBLISHABLE_KEY=...
VITE_SUPABASE_PROJECT_ID=...
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- Email: support@erpmax.pk
- Documentation: [Project Wiki](https://github.com/your-org/erpmax/wiki)
- Issues: [GitHub Issues](https://github.com/your-org/erpmax/issues)

## 🗺️ Roadmap

- [ ] Mobile app (React Native)
- [ ] Advanced reporting
- [ ] API integrations
- [ ] Multi-language support
- [ ] Advanced inventory features
- [ ] Payroll management
- [ ] Fixed asset management

---

Built with ❤️ in Pakistan for Pakistani businesses
