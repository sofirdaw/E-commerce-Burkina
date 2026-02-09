import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Tous les champs sont obligatoires' },
        { status: 400 }
      );
    }

    // Email validation simple
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Email invalide' },
        { status: 400 }
      );
    }

    // VOTRE EMAIL comme destinataire par défaut
    const targetEmail = process.env.CONTACT_EMAIL || 'sofirdaw@gmail.com';

    // Template HTML professionnel
    const htmlTemplate = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #f97316, #ea580c); padding: 30px; border-radius: 10px; color: white; text-align: center; margin-bottom: 30px;">
          <h1 style="margin: 0; font-size: 28px;">🇧🇫 Ecomm-Burkina</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Nouveau message de contact</p>
        </div>
        
        <div style="background: #f8fafc; padding: 25px; border-radius: 10px; margin-bottom: 20px;">
          <h2 style="color: #333; margin-top: 0; border-bottom: 2px solid #f97316; padding-bottom: 10px;">
            📧 Détails du message
          </h2>
          
          <div style="margin-bottom: 15px;">
            <strong style="color: #f97316;">👤 Nom complet:</strong>
            <p style="margin: 5px 0; color: #666; background: white; padding: 10px; border-radius: 5px;">${name}</p>
          </div>
          
          <div style="margin-bottom: 15px;">
            <strong style="color: #f97316;">📧 Email de contact:</strong>
            <p style="margin: 5px 0; color: #666; background: white; padding: 10px; border-radius: 5px;">${email}</p>
          </div>
          
          <div style="margin-bottom: 15px;">
            <strong style="color: #f97316;">📋 Sujet:</strong>
            <p style="margin: 5px 0; color: #666; background: white; padding: 10px; border-radius: 5px;">${subject}</p>
          </div>
          
          <div style="margin-bottom: 15px;">
            <strong style="color: #f97316;">💬 Message:</strong>
            <div style="margin: 5px 0; color: #666; background: white; padding: 15px; border-radius: 5px; line-height: 1.6; white-space: pre-wrap;">${message}</div>
          </div>
        </div>
        
        <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
          <p style="margin: 0; color: #856404;">
            <strong>⏰ Date d'envoi:</strong> ${new Date().toLocaleString('fr-FR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric', 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </p>
        </div>
        
        <div style="text-align: center; padding: 20px; background: #f1f5f9; border-radius: 10px;">
          <p style="margin: 0; color: #666; font-size: 14px;">
            Cet email a été envoyé depuis le formulaire de contact de Ecomm-Burkina
          </p>
          <p style="margin: 10px 0 0 0; color: #666; font-size: 12px;">
            📍 Marketplace du Burkina Faso | 🇧🇫
          </p>
        </div>
      </div>
    `;

    // Essayer d'envoyer avec Resend si configuré
    if (process.env.RESEND_API_KEY) {
      try {
        const { Resend } = await import('resend');
        const resend = new Resend(process.env.RESEND_API_KEY);

        const { data, error } = await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || 'noreply@ecomm-burkina.com',
          to: [targetEmail],
          replyTo: email,
          subject: `Contact Ecomm-Burkina: ${subject}`,
          html: htmlTemplate,
        });

        if (error) {
          console.error('❌ Erreur Resend:', error);
          throw new Error('Resend failed');
        }

        console.log('✅ Email envoyé avec succès via Resend vers:', targetEmail);
        return NextResponse.json({ 
          success: true, 
          message: 'Message envoyé avec succès!' 
        });
      } catch (resendError) {
        console.log('⚠️ Resend échoué, tentative avec Nodemailer...');
      }
    }

    // Utiliser Nodemailer (fallback ou si Resend non configuré)
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      try {
        console.log('🔧 Configuration SMTP:');
        console.log('📧 Host:', process.env.SMTP_HOST || 'smtp.gmail.com');
        console.log('📧 Port:', process.env.SMTP_PORT || '587');
        console.log('📧 Secure:', process.env.SMTP_SECURE === 'true');
        console.log('📧 User:', process.env.SMTP_USER);
        console.log('📧 Pass configuré:', !!process.env.SMTP_PASS);
        
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST || 'smtp.gmail.com',
          port: parseInt(process.env.SMTP_PORT || '587'),
          secure: process.env.SMTP_SECURE === 'true',
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
          debug: true, // Activer les logs détaillés
          logger: true, // Activer le logger
        });

        // Test de connexion
        console.log('🔧 Test de connexion SMTP...');
        await transporter.verify();
        console.log('✅ Connexion SMTP réussie!');

        const mailOptions = {
          from: `"Ecomm-Burkina" <${process.env.SMTP_USER}>`,
          to: targetEmail,
          replyTo: email,
          subject: `Contact Ecomm-Burkina: ${subject}`,
          html: htmlTemplate,
        };

        console.log('📧 Envoi de l\'email...');
        const result = await transporter.sendMail(mailOptions);
        console.log('✅ Email envoyé avec succès via Nodemailer vers:', targetEmail);
        console.log('📧 Résultat:', result.messageId);
        
        return NextResponse.json({ 
          success: true, 
          message: 'Message envoyé avec succès!' 
        });
      } catch (smtpError) {
        console.error('❌ Erreur Nodemailer détaillée:', smtpError);
        console.error('❌ Code erreur:', smtpError.code);
        console.error('❌ Message:', smtpError.message);
        
        // Messages d'erreur spécifiques
        if (smtpError.code === 'EAUTH') {
          return NextResponse.json(
            { error: 'Erreur d\'authentification SMTP. Vérifiez votre email et mot de passe d\'application.' },
            { status: 500 }
          );
        } else if (smtpError.code === 'ECONNECTION') {
          return NextResponse.json(
            { error: 'Erreur de connexion SMTP. Vérifiez votre connexion internet et les paramètres SMTP.' },
            { status: 500 }
          );
        } else {
          return NextResponse.json(
            { error: `Erreur SMTP: ${smtpError.message}` },
            { status: 500 }
          );
        }
      }
    }

    // Si aucun service n'est configuré, simuler pour le test
    console.log('📧 Simulation d\'envoi d\'email (Aucun service configuré)');
    console.log('📧 Destinataire:', targetEmail);
    console.log('👤 Nom:', name);
    console.log('📧 Sujet:', subject);
    console.log('💬 Message:', message);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Message envoyé avec succès! (Mode test - Configurez Resend ou SMTP pour recevoir réellement les emails)' 
    });

  } catch (error) {
    console.error('❌ Erreur générale lors de l\'envoi de l\'email:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'envoi du message. Veuillez réessayer.' },
      { status: 500 }
    );
  }
}
