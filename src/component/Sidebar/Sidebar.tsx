type Template = {
  name: string;
  blocks: any[];
};

type SidebarProps = {
  onTemplateSelect: (blocks: any[]) => void;
};

const defaultTemplates: Template[] = [
  {
    name: 'Blank',
    blocks: [],
  },
  {
    name: 'Welcome',
    blocks: [
      { type: 'heading', content: 'Welcome to Our Service!' },
      { type: 'paragraph', content: 'We are excited to have you on board. Get started by exploring our features.' },
      {
        type: 'button',
        content: 'Get Started',
        url: 'https://example.com',
        backgroundColor: '#007bff',
        textColor: '#fff',
      },
      { type: 'divider', thickness: 1, dividerColor: '#e5e7eb' },
      { type: 'paragraph', content: 'If you have any questions, just reply to this email.' },
    ],
  },
  {
    name: 'Receipt',
    blocks: [
      { type: 'heading', content: 'Your Receipt' },
      { type: 'paragraph', content: 'Thank you for your purchase! Here are your order details:' },
      { type: 'divider', thickness: 1, dividerColor: '#e5e7eb' },
      { type: 'paragraph', content: 'Order #123456\nTotal: $49.99' },
      {
        type: 'button',
        content: 'View Order',
        url: 'https://example.com/orders',
        backgroundColor: '#10b981',
        textColor: '#fff',
      },
    ],
  },
  {
    name: 'OTP',
    blocks: [
      { type: 'heading', content: 'Your One-Time Passcode' },
      { type: 'paragraph', content: 'Use the code below to sign in:' },
      { type: 'heading', content: '123456', level: 2 },
      { type: 'paragraph', content: 'This code will expire in 10 minutes.' },
    ],
  },
  {
    name: 'Reset Password',
    blocks: [
      { type: 'heading', content: 'Reset Your Password' },
      { type: 'paragraph', content: 'Click the button below to reset your password.' },
      {
        type: 'button',
        content: 'Reset Password',
        url: 'https://example.com/reset',
        backgroundColor: '#f59e42',
        textColor: '#fff',
      },
    ],
  },
];

export default function Sidebar({ onTemplateSelect }: SidebarProps) {
  return (
    <div className="w-72 border-r border-gray-200 p-4 bg-white flex flex-col" style={{ height: '100%' }}>
      <div className="font-bold mb-3 text-gray-800">Templates</div>
      <ul className="flex flex-col gap-1">
        {defaultTemplates.map((tpl) => (
          <li
            key={tpl.name}
            className="px-3 py-2 rounded cursor-pointer hover:bg-blue-50 transition-colors font-medium text-gray-700 border border-transparent hover:border-blue-200"
            style={{ background: tpl.name === 'Blank' ? '#f9fafb' : '#f3f4f6' }}
            onClick={() => onTemplateSelect(tpl.blocks)}
          >
            {tpl.name}
          </li>
        ))}
      </ul>
      <div className="mt-4 text-gray-500 text-xs">
        Choose a template to quickly start your email. You can fully customize the content after loading a template.
      </div>
    </div>
  );
}
