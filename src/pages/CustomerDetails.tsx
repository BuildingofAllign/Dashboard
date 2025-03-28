
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Building2, Mail, MapPin, Phone } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCustomers } from "@/hooks/use-customers";

const CustomerDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { customers } = useCustomers();
  
  const customer = customers.find(c => c.id === id);
  
  if (!customer) {
    return (
      <>
        <Header title="Kunde ikke fundet" userInitials="BL" />
        <div className="container py-6 max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center py-12">
            <h1 className="text-2xl font-bold mb-4">Kunde ikke fundet</h1>
            <p className="text-muted-foreground mb-6">
              Den kunde, du leder efter, findes ikke.
            </p>
            <Button onClick={() => navigate('/kunder')}>
              Tilbage til kundeoversigt
            </Button>
          </div>
        </div>
      </>
    );
  }
  
  return (
    <>
      <Header title={customer.name} userInitials="BL" />
      <div className="container py-6 max-w-7xl mx-auto space-y-6">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/kunder')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Tilbage til kundeoversigt
          </Button>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Kundeinformation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground text-sm">Virksomhed</span>
                  <span className="font-medium text-lg">{customer.name}</span>
                </div>
                
                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground text-sm">CVR-nummer</span>
                  <span>{customer.cvr}</span>
                </div>
                
                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground text-sm">Rolle</span>
                  <span>{customer.role}</span>
                </div>
                
                <Separator />
                
                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground text-sm">Adresse</span>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                    <span>{customer.address}</span>
                  </div>
                </div>
                
                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground text-sm">Fakturering</span>
                  <div className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <span>{customer.invoiceEmail}</span>
                  </div>
                  <p className="text-sm">Betalingsbetingelser: {customer.paymentTerms}</p>
                </div>
              </CardContent>
            </Card>
            
            {/* Her kan tilføjes flere sektioner som projekter, aktivitetslog etc. */}
          </div>
          
          <div className="md:w-1/3 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Kontaktpersoner</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {customer.contactPersons.map((person, index) => (
                  <div key={index} className="space-y-2">
                    {index > 0 && <Separator className="my-4" />}
                    <div className="flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{person.name}</p>
                        {person.position && (
                          <p className="text-sm text-muted-foreground">{person.position}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="ml-7 space-y-1">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{person.phone}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{person.email}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomerDetails;
