'use client';

import { useEffect, useState } from 'react';
import { Building, Search, Home, MapPin, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { adminService } from '@/services/admin.service';

export default function PropertiesOverviewPage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchProperties = async () => {
    setIsLoading(true);
    try {
      const res = await adminService.getProperties({ search });
      setProperties(res.properties);
    } catch (error) {
      console.error("Failed to fetch properties", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProperties();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Properties</h1>
          <p className="text-muted-foreground">Platform-wide property overview.</p>
        </div>
      </div>

      <Card className="bg-card/50 backdrop-blur-xl border-border/50">
        <CardHeader className="pb-4 border-b border-border/50">
          <form onSubmit={handleSearch} className="flex w-full max-w-md items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by name or address..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-background/50 border-border/50"
              />
            </div>
            <Button type="submit" variant="secondary">Search</Button>
          </form>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground animate-pulse">Loading properties...</div>
          ) : properties.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">No properties found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border/50">
                  <tr>
                    <th className="px-6 py-4 font-medium">Property</th>
                    <th className="px-6 py-4 font-medium">Owner (Landlord)</th>
                    <th className="px-6 py-4 font-medium">Occupancy</th>
                    <th className="px-6 py-4 font-medium">Units Detail</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {properties.map((property) => (
                    <tr key={property.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground flex items-center gap-1.5">
                            <Building className="h-3.5 w-3.5 text-emerald-500" />
                            {property.name}
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                            <MapPin className="h-3 w-3" />
                            {property.address}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground flex items-center gap-1.5">
                            <Users className="h-3.5 w-3.5 text-muted-foreground" />
                            {property.owner.fullName}
                          </span>
                          <span className="text-xs text-muted-foreground">{property.owner.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">Rate:</span>
                            <span className="font-medium text-foreground">
                              {property.totalUnits > 0 ? Math.round((property.occupiedUnits / property.totalUnits) * 100) : 0}%
                            </span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-1.5">
                            <div 
                              className="bg-emerald-500 h-1.5 rounded-full" 
                              style={{ width: `${property.totalUnits > 0 ? (property.occupiedUnits / property.totalUnits) * 100 : 0}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-3 text-xs">
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <Home className="h-3.5 w-3.5" /> Total: {property.totalUnits}
                          </span>
                          <span className="flex items-center gap-1 text-emerald-500">
                            Occupied: {property.occupiedUnits}
                          </span>
                          <span className="flex items-center gap-1 text-orange-500">
                            Vacant: {property.vacantUnits}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
