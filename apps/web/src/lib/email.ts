import { NextRequest } from 'next/server';

// Configuration pour l'envoi d'emails
// En production, utilisez un service comme SendGrid, Resend, ou Nodemailer

export async function sendVendorApplicationEmail(application: any) {
  try {
    // Simuler l'envoi d'email à l'admin
    console.log('📧 Nouvelle demande de revendeur:', {
      nom: `${application.firstName} ${application.lastName}`,
      email: application.email,
      telephone: application.phone,
      entreprise: application.businessName,
      type: application.businessType,
      description: application.description,
    });

    // En production, utilisez:
    // await resend.emails.send({
    //   from: 'noreply@ecomm-burkina.com',
    //   to: 'admin@ecomm-burkina.com',
    //   subject: 'Nouvelle demande de revendeur - E-BURKINA',
    //   html: generateVendorApplicationEmailHTML(application),
    // });

    return true;
  } catch (error) {
    console.error('Error sending vendor application email:', error);
    return false;
  }
}

export async function sendVendorApprovalEmail(application: any, tempPassword: string) {
  try {
    // Simuler l'envoi d'email au revendeur
    console.log('📧 Email d\'approbation envoyé à:', application.email);
    console.log('🔐 Mot de passe temporaire:', tempPassword);

    // En production, utilisez:
    // await resend.emails.send({
    //   from: 'noreply@ecomm-burkina.com',
    //   to: application.email,
    //   subject: 'Bienvenue chez E-BURKINA - Votre accès revendeur',
    //   html: generateVendorApprovalEmailHTML(application, tempPassword),
    // });

    return true;
  } catch (error) {
    console.error('Error sending vendor approval email:', error);
    return false;
  }
}

function generateVendorApplicationEmailHTML(application: any) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #f97316; padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">E-BURKINA</h1>
        <p style="color: white; margin: 5px 0 0;">Nouvelle demande de revendeur</p>
      </div>
      
      <div style="padding: 20px; background-color: #f9f9f9;">
        <h2 style="color: #333; margin-top: 0;">Informations du demandeur</h2>
        
        <div style="background-color: white; padding: 15px; border-radius: 5px; margin-bottom: 15px;">
          <p><strong>Nom:</strong> ${application.firstName} ${application.lastName}</p>
          <p><strong>Email:</strong> ${application.email}</p>
          <p><strong>Téléphone:</strong> ${application.phone}</p>
          <p><strong>Entreprise:</strong> ${application.businessName}</p>
          <p><strong>Type d'entreprise:</strong> ${application.businessType}</p>
          <p><strong>Adresse:</strong> ${application.address}</p>
        </div>
        
        <div style="background-color: white; padding: 15px; border-radius: 5px;">
          <h3 style="margin-top: 0;">Description:</h3>
          <p>${application.description}</p>
        </div>
        
        <div style="text-align: center; margin-top: 20px;">
          <a href="https://ecomm-burkina.com/admin/vendors/applications" 
             style="background-color: #f97316; color: white; padding: 12px 24px; 
                    text-decoration: none; border-radius: 5px; display: inline-block;">
            Voir les demandes
          </a>
        </div>
      </div>
      
      <div style="padding: 20px; text-align: center; color: #666; font-size: 12px;">
        <p>Cet email a été envoyé automatiquement par E-BURKINA</p>
      </div>
    </div>
  `;
}

function generateVendorApprovalEmailHTML(application: any, tempPassword: string) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #f97316; padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">E-BURKINA</h1>
        <p style="color: white; margin: 5px 0 0;">Bienvenue dans notre réseau de revendeurs!</p>
      </div>
      
      <div style="padding: 20px; background-color: #f9f9f9;">
        <h2 style="color: #333; margin-top: 0;">Votre demande a été approuvée!</h2>
        
        <p>Bonjour ${application.firstName},</p>
        <p>Nous avons le plaisir de vous informer que votre demande de revendeur a été approuvée. 
           Vous pouvez maintenant accéder à votre panel revendeur et commencer à vendre vos produits.</p>
        
        <div style="background-color: white; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Vos accès:</h3>
          <p><strong>Email:</strong> ${application.email}</p>
          <p><strong>Mot de passe temporaire:</strong> <code style="background-color: #f0f0f0; padding: 2px 4px;">${tempPassword}</code></p>
          <p style="color: #666; font-size: 14px;">Veuillez changer votre mot de passe lors de votre première connexion.</p>
        </div>
        
        <div style="background-color: #e3f2fd; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #1976d2;">Commission de 10%</h3>
          <p>Vous recevrez une commission de 10% sur chaque produit vendu. 
             Suivez vos performances en temps réel depuis votre panel.</p>
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
          <a href="https://ecomm-burkina.com/vendor-panel" 
             style="background-color: #f97316; color: white; padding: 12px 24px; 
                    text-decoration: none; border-radius: 5px; display: inline-block;">
            Accéder à mon panel
          </a>
        </div>
        
        <div style="margin-top: 20px; padding: 15px; background-color: #fff3cd; border-radius: 5px;">
          <p style="margin: 0; color: #856404;">
            <strong>Important:</strong> Gardez vos identifiants sécurisés et ne les partagez avec personne.
          </p>
        </div>
      </div>
      
      <div style="padding: 20px; text-align: center; color: #666; font-size: 12px;">
        <p>Cet email a été envoyé automatiquement par E-BURKINA</p>
        <p>Si vous avez des questions, contactez-nous à support@ecomm-burkina.com</p>
      </div>
    </div>
  `;
}
