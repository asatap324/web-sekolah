import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardPanel, CardHeader, CardTitle } from "@/components/ui/card";
import { StyledCard } from "@/components/shared";

const data = [
  {
    id: 1,
    name: "Nama Sekolah",
    value: "SMP Negeri 04 Muncar Satu Atap",
  },
  {
    id: 2,
    name: "Alamat",
    value:
      "Dusun Kabatmantren RT. 03 RW. 06, Wringinputih, Muncar, Banyuwangi, Jawa Timur 68472",
  },
  {
    id: 3,
    name: "NPSN",
    value: "20540136",
  },
  {
    id: 4,
    name: "Akreditasi",
    value: "B",
  },
  {
    id: 5,
    name: "No. Sk Akreditasi",
    value: "164/BAP-S/M/SK/XI/2017",
  },
  {
    id: 6,
    name: "Status",
    value: "Negeri",
  },
  {
    id: 7,
    name: "Jenjang Pendidikan",
    value: "SMP",
  },
  {
    id: 8,
    name: "SK Pendirian",
    value: "188/501/KEP/429.012/2006",
  },
  {
    id: 9,
    name: "Tanggal SK Pendirian",
    value: "2006-06-07",
  },
  {
    id: 10,
    name: "SK Ijin Operasional",
    value: "-",
  },
  {
    id: 11,
    name: "Tanggal SK Ijin Operasional",
    value: "1910-01-01",
  },
];

export function SchoolDataTable() {
  return (
    <StyledCard>
      <div className="p-4">
        <div className="mb-5">
          <h2 className="text-2xl font-bold tracking-tight">Data Sekolah</h2>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/3">Data</TableHead>

              <TableHead>Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell className="text-muted-foreground">
                  : {item.value}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </StyledCard>
  );
}
