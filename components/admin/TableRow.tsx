export default function TableRow({ name, email, role, date }: { name: string; email: string; role: string; date: string; }) {
  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{name}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{email}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{role}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{date ? new Date(date).toLocaleString() : "—"}</td>
    </tr>
  );
}
