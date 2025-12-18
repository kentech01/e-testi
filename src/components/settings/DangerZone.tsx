import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Separator } from '../../ui/separator';
import { Trash2 } from 'lucide-react';

interface DangerZoneProps {
  onLogout: () => void;
}

export function DangerZone({ onLogout }: DangerZoneProps) {
  return (
    <Card className="border-destructive/20">
      {/* <CardHeader> */}
        {/* <CardTitle className="flex items-center space-x-2 text-destructive">
          <Trash2 className="w-5 h-5" />
          <span>Zona e rrezikshme</span>
        </CardTitle> */}
      {/* </CardHeader> */}
      <CardContent className="space-y-4 ">
        {/* <div className="p-4 bg-destructive/5 border border-destructive/20 rounded-lg">
          <h4 className="font-medium text-destructive mb-2">Fshi llogarinë</h4>
          <p className="text-sm text-muted-foreground mb-4">
            Ky veprim nuk mund të zhbëhet. Të gjitha të dhënat tuaja, përfshirë rezultatet e testeve dhe progresin, do të fshihen përfundimisht.
          </p>
          <Button variant="destructive" size="sm">
            Fshi llogarinë
          </Button>
        </div> */}
        
        {/* <Separator /> */}
        
        <Button variant="ghost" onClick={onLogout} className="w-full justify-start text-muted-foreground hover:text-foreground mt-7">
          Dil nga llogaria
        </Button>
      </CardContent>
    </Card>
  );
} 