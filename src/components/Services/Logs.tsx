import { Trash2, Download, Edit2, Copy } from "lucide-react";

export default function Logs() {
  return (
    <table className="table-auto w-full text-sm">
      <thead className="bg-gray-200 dark:bg-gray-700">
        <tr>
          <th className="w-[20px] px-4 py-2.5">
            <input type="checkbox" className="flex" />
          </th>
          <th className="text-left p-2.5">Name</th>
          <th className="text-left p-2.5">Creation On</th>
          <th className="text-left p-2.5">Creation By</th>
          <th className="text-left p-2.5">Client ID</th>
          <th className="p-2.5">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr className="border-b border-black/10 dark:border-white/10">
          <td className="text-left px-4 py-2.5">
            <input type="checkbox" className="flex" />
          </td>
          <td className="text-left p-2.5">Webclient</td>
          <td className="text-left p-2.5">24-03-2025</td>
          <td className="text-left p-2.5">Sayan Das</td>
          <td className="text-left p-2.5">
            <a href="#" className="flex items-center">
              <span className="me-2">3569709469305-rdf...</span>
              <Copy size={15} className="text-green-600" />
            </a>
          </td>
          <td className="text-left p-2.5">
            <div className="flex items-center justify-center">
              <Edit2 size={16} className="text-blue-500 hover:text-blue-600 me-3 cursor-pointer" />
              <Trash2 size={16} className="text-red-600 me-3 cursor-pointer" />
              <Download size={16} className="text-gray-700 dark:text-gray-100 cursor-pointer" />
            </div>
          </td>
        </tr>
        <tr className="border-b border-black/10 dark:border-white/10">
          <td className="text-left px-4 py-2.5">
            <input type="checkbox" className="flex" />
          </td>
          <td className="text-left p-2.5">Desktop Application</td>
          <td className="text-left p-2.5">25-03-2025</td>
          <td className="text-left p-2.5">Soumen Sardar</td>
          <td className="text-left p-2.5">
            <a href="#" className="flex items-center">
              <span className="me-2">9669869441305-cdq...</span>
              <Copy size={15} className="text-green-600" />
            </a>
          </td>
          <td className="text-left p-2.5">
            <div className="flex items-center justify-center">
              <Edit2 size={16} className="text-blue-500 hover:text-blue-600 me-3 cursor-pointer" />
              <Trash2 size={16} className="text-red-600 me-3 cursor-pointer" />
              <Download size={16} className="text-gray-700 dark:text-gray-100 cursor-pointer" />
            </div>
          </td>
        </tr>
        <tr>
          <td className="text-left px-4 py-2.5">
            <input type="checkbox" className="flex" />
          </td>
          <td className="text-left p-2.5">Mobile Application</td>
          <td className="text-left p-2.5">27-03-2025</td>
          <td className="text-left p-2.5">Susanta Das</td>
          <td className="text-left p-2.5">
            <a href="#" className="flex items-center">
              <span className="me-2">4969709441305-acd...</span>
              <Copy size={15} className="text-green-600" />
            </a>
          </td>
          <td className="text-left p-2.5">
            <div className="flex items-center justify-center">
              <Edit2 size={16} className="text-blue-500 hover:text-blue-600 me-3 cursor-pointer" />
              <Trash2 size={16} className="text-red-600 me-3 cursor-pointer" />
              <Download size={16} className="text-gray-700 dark:text-gray-100 cursor-pointer" />
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  )
}